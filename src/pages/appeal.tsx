import React, { useEffect, useEffectEvent, useState, useRef } from "react";
import Head from "../components/Head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppealForm from "../components/AppealForm";
import { consumeLoginState, getLoginUrl } from "../utils/keycloak";
import { decodeJwtPayload } from "../utils/jwt";

interface Appeal {
  status: string;
  created_at: string;
  decided_at?: string;
  reminded_at?: string;
  response_message?: string;
  reason?: string;
  solution?: string;
  future?: string;
  extra?: string;
}

const INVALID_APPEAL_HISTORY = "Invalid appeal history";

function parseLatestAppeal(data: unknown): Appeal | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(INVALID_APPEAL_HISTORY);
  }
  if ("appeal" in data && data.appeal === null && !("id" in data)) {
    return null;
  }
  const appeal = data as Record<string, unknown>;
  if (
    typeof appeal.id !== "string" ||
    !appeal.id ||
    typeof appeal.status !== "string" ||
    !["RECEIVED", "ACCEPTED", "DENIED"].includes(appeal.status) ||
    typeof appeal.created_at !== "string" ||
    !Number.isFinite(Date.parse(appeal.created_at))
  ) {
    throw new Error(INVALID_APPEAL_HISTORY);
  }
  const optionalText = [
    "decided_at",
    "reminded_at",
    "response_message",
    "reason",
    "solution",
    "future",
    "extra",
  ];
  if (
    optionalText.some(
      (key) => appeal[key] != null && typeof appeal[key] !== "string",
    )
  ) {
    throw new Error(INVALID_APPEAL_HISTORY);
  }
  return appeal as unknown as Appeal;
}

type BanStatus =
  "unknown" | "can_appeal" | "has_appeal" | "not_banned" | "can_reappeal";

function reminderAvailableAt(appeal: Appeal): Date {
  const baseTime = new Date(appeal.reminded_at ?? appeal.created_at).getTime();
  const cooldown =
    process.env.NODE_ENV === "development" ? 30_000 : 48 * 60 * 60 * 1000;
  return new Date(baseTime + cooldown);
}

// What a banned user can do next, based on their latest appeal (if any)
function statusForBannedUser(
  appeal: Appeal | null,
  canReappeal: (appeal: Appeal) => boolean,
): BanStatus {
  // No appeal yet, or the last one was accepted (so it was for an earlier ban)
  if (!appeal || appeal.status === "ACCEPTED") {
    return "can_appeal";
  }
  // A denied appeal can be retried once the waiting period is over
  if (appeal.status === "DENIED" && canReappeal(appeal)) {
    return "can_reappeal";
  }
  // Still pending (RECEIVED), or denied and still inside the waiting period
  return "has_appeal";
}

const AppealHead = () => (
  <Head
    title="Ban Appeal - TripSit"
    description="Banned from TripSit? Log in with Discord to check your ban status and send an appeal to our team."
    path="/appeal"
  />
);

const AppealPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [banStatus, setBanStatus] = useState<BanStatus>("unknown");
  const [latestAppeal, setLatestAppeal] = useState<Appeal | null>(null);
  const [reminderNow, setReminderNow] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    kind: "success" | "error";
  } | null>(null);
  // Set when logging in or checking the ban fails, so the page can say so instead of
  // falling back to the login screen or an empty page.
  const [loginFailed, setLoginFailed] = useState(false);
  const [banCheckFailed, setBanCheckFailed] = useState(false);
  const [appealHistoryFailed, setAppealHistoryFailed] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [remindMessage, setRemindMessage] = useState<string | null>(null);
  const [showAppealContent, setShowAppealContent] = useState(false);

  useEffect(() => {
    if (!latestAppeal) return;
    const availableAt = reminderAvailableAt(latestAppeal).getTime();
    if (!Number.isFinite(availableAt)) return;
    const timer = globalThis.setTimeout(
      () => setReminderNow(Date.now()),
      Math.max(0, availableAt - Date.now()),
    );
    return () => globalThis.clearTimeout(timer);
  }, [latestAppeal]);

  // Share a pending refresh so concurrent requests use the same tokens.
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  // Use ref to prevent concurrent checkBan calls
  const isCheckingBanRef = useRef<boolean>(false);

  async function refreshTokenIfNeeded() {
    // If already refreshing, wait for that promise to complete
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const savedToken = sessionStorage.getItem("kc_token");
    const refreshToken = sessionStorage.getItem("kc_refresh_token");

    if (!savedToken) return null;

    try {
      const expiresAt = Number(decodeJwtPayload(savedToken).exp) * 1000;
      const now = Date.now();

      // If token expires within 60 seconds, refresh it
      if (expiresAt - now < 60000) {
        if (refreshToken) {
          // Share the promise to prevent concurrent refreshes.
          refreshPromiseRef.current = (async () => {
            try {
              const refreshRes = await fetch("/api/v2/keycloak/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });

              if (refreshRes.ok) {
                const newTokens = await refreshRes.json();
                sessionStorage.setItem("kc_token", newTokens.access_token);

                if (newTokens.refresh_token) {
                  sessionStorage.setItem(
                    "kc_refresh_token",
                    newTokens.refresh_token,
                  );
                }

                // Set ID token for post logout
                if (newTokens.id_token) {
                  sessionStorage.setItem("kc_id_token", newTokens.id_token);
                }

                globalThis.dispatchEvent(new Event("tokensUpdated"));
                return newTokens.access_token;
              }
              sessionStorage.removeItem("kc_token");
              sessionStorage.removeItem("kc_refresh_token");
              return null;
            } finally {
              refreshPromiseRef.current = null;
            }
          })();

          return await refreshPromiseRef.current;
        }
        sessionStorage.removeItem("kc_token");
        return null;
      }

      return savedToken;
    } catch {
      sessionStorage.removeItem("kc_token");
      sessionStorage.removeItem("kc_refresh_token");
      return null;
    }
  }

  async function getAuthHeaders() {
    const validToken = await refreshTokenIfNeeded();

    if (!validToken) {
      throw new Error("No valid token available");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${validToken}`,
    };
  }

  async function exchangeCodeForToken(code: string) {
    try {
      const params = new URLSearchParams(globalThis.location.search);
      const codeVerifier = consumeLoginState(params.get("state"));
      if (!codeVerifier) {
        setLoginFailed(true);
        return;
      }
      const res = await fetch("/api/v2/keycloak/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, code_verifier: codeVerifier }),
      });
      const data = res.ok ? await res.json() : {};
      if (data.access_token) {
        // Store both tokens
        sessionStorage.setItem("kc_token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("kc_refresh_token", data.refresh_token);
        }
        setToken(data.access_token);

        if (data.id_token) {
          sessionStorage.setItem("kc_id_token", data.id_token);
        }

        // Dispatch event for ProfileButton
        globalThis.dispatchEvent(new Event("tokensUpdated"));
        void checkBan();
      } else {
        setLoginFailed(true);
      }
    } catch {
      setLoginFailed(true);
    } finally {
      // A code works only once, so remove it from the URL whether or not the login worked.
      document.title = "Ban Appeal - TripSit";
      globalThis.history.replaceState({}, "", globalThis.location.pathname);
      setLoading(false);
    }
  }

  async function startLogin() {
    setLoginFailed(false);
    try {
      globalThis.location.href = await getLoginUrl();
    } catch {
      setLoginFailed(true);
    }
  }

  function canReappeal(appeal: Appeal | null): boolean {
    if (!appeal?.decided_at) return false;

    const decidedAt = new Date(appeal.decided_at);

    // 30 seconds for development
    if (process.env.NODE_ENV === "development") {
      const thirtySecondsAgo = new Date();
      thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
      return decidedAt <= thirtySecondsAgo;
    }

    // 3 months for production
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    return decidedAt <= threeMonthsAgo;
  }

  function canShowReminder(appeal: Appeal): boolean {
    return reminderNow >= reminderAvailableAt(appeal).getTime();
  }

  async function checkBan() {
    // Prevent concurrent executions
    if (isCheckingBanRef.current) {
      return;
    }

    isCheckingBanRef.current = true;
    setBanCheckFailed(false);
    setAppealHistoryFailed(false);

    let checkingHistory = false;
    try {
      // Reset appeal state at start to prevent stale data
      setLatestAppeal(null);

      // Verify we have a token in sessionStorage before attempting API calls
      const savedToken = sessionStorage.getItem("kc_token");
      if (!savedToken) {
        setBanStatus("unknown");
        setBanCheckFailed(true);
        setLoading(false);
        return;
      }

      // Get auth headers once and reuse them for all requests in this function
      const headers = await getAuthHeaders();

      // Check ban status (no Discord ID needed - comes from token)
      const banRes = await fetch("/api/v2/users/banned", {
        headers,
      });

      if (!banRes.ok) {
        throw new Error("Failed to check ban status");
      }

      const currentBanStatus = await banRes.json();

      // Check for appeal history (works for both banned and not banned users)
      checkingHistory = true;
      const appealsRes = await fetch("/api/v2/appeals/latest", {
        headers,
      });

      if (!appealsRes.ok) {
        throw new Error("Failed to check appeal history");
      }
      const appeal = parseLatestAppeal(await appealsRes.json());
      setLatestAppeal(appeal);

      if (!currentBanStatus.banned) {
        setBanStatus("not_banned");
        setLoading(false);
        return;
      }

      // User is banned - determine appeal status
      setBanStatus(statusForBannedUser(appeal, canReappeal));
    } catch {
      setBanStatus("unknown");
      setBanCheckFailed(true);
      setAppealHistoryFailed(checkingHistory);
    } finally {
      setLoading(false);
      isCheckingBanRef.current = false;
    }
  }

  async function submitAppeal(data: {
    reason: string;
    solution: string;
    future: string;
    extra?: string;
  }) {
    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();

      const res = await fetch("/api/v2/appeals/create", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const successData = await res.json();
        setMessage({
          text: successData.message ?? "Your appeal has been submitted.",
          kind: "success",
        });
        setBanStatus("has_appeal");
        // Refresh to get the new appeal
        void checkBan();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await res.json();
        let userMessage = errorData.error ?? "Failed to submit appeal";

        // Make technical error messages more user-friendly
        if (userMessage.includes("User not found in database")) {
          userMessage =
            "Your account could not be found. Please try logging out and logging in again.";
        } else if (
          userMessage.includes("Failed to create appeal due to a server error")
        ) {
          userMessage =
            "An error occurred while submitting your appeal. Please try again later.";
        }

        setMessage({ text: userMessage, kind: "error" });
      }
    } catch (e) {
      if (e instanceof Error && e.message === "No valid token available") {
        setMessage({
          text: "Session expired. Please refresh the page and log in again.",
          kind: "error",
        });
      } else {
        setMessage({ text: "Error submitting appeal.", kind: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function sendReminder() {
    setReminding(true);
    setRemindMessage(null);

    try {
      const res = await fetch("/api/v2/appeals/remind", {
        method: "POST",
        headers: await getAuthHeaders(),
      });

      const data = await res.json();

      if (res.ok) {
        setRemindMessage(data.message);
        // Refresh the appeal data to get updated reminded_at
        void checkBan();
      } else {
        setRemindMessage(data.error);
      }
    } catch {
      setRemindMessage("Failed to send reminder");
    } finally {
      setReminding(false);
    }
  }

  const getStatusBadge = (status = "Unknown") => {
    switch (status) {
      case "ACCEPTED":
        return <span className="badge bg-success fs-6">Accepted</span>;
      case "DENIED":
        return <span className="badge bg-danger fs-6">Denied</span>;
      case "RECEIVED":
        return (
          <span className="badge bg-warning text-dark fs-6">Under Review</span>
        );
      default:
        return <span className="badge bg-secondary fs-6">{status}</span>;
    }
  };

  // Effect events: the effects below call these when a token arrives, but shouldn't re-run
  // just because the functions are new on each render.
  const checkBanForNewToken = useEffectEvent(() => {
    void checkBan();
  });
  const logInWithCode = useEffectEvent((code: string) => {
    void exchangeCodeForToken(code);
  });

  // Check if we already have a token in session storage, also handle refreshing tokens.
  useEffect(() => {
    const checkToken = async () => {
      const validToken = await refreshTokenIfNeeded();
      if (validToken) {
        // Ensure token state is set BEFORE any other operations
        setToken(validToken);
        checkBanForNewToken();
        // Clean up any lingering auth query params from URL
        if (globalThis.location.search) {
          document.title = "Ban Appeal - TripSit";
          globalThis.history.replaceState({}, "", globalThis.location.pathname);
        }
      } else {
        // Look for auth code for fresh login
        const params = new URLSearchParams(globalThis.location.search);
        const code = params.get("code");
        if (code) {
          // exchangeCodeForToken handles both setToken and setLoading
          logInWithCode(code);
        } else {
          // Only set loading to false if there's truly no token and no code
          setLoading(false);
        }
      }
    };

    void checkToken();
  }, []);

  // Set up background token refresh when we have a token
  useEffect(() => {
    if (!token) return;
    // Set up new interval to refresh every 30 seconds
    // setInterval ignores a callback's return value, so hand it a plain function and let
    // the refresh promise run on its own.
    const refreshInterval = setInterval(() => {
      void refreshTokenIfNeeded().then((refreshedToken) => {
        // Only update token state if it actually changed to prevent unnecessary re-renders
        if (refreshedToken && refreshedToken !== token) {
          setToken(refreshedToken);
          checkBanForNewToken();
        } else if (!refreshedToken) {
          // Token is now invalid, clear it
          setToken(null);
          clearInterval(refreshInterval);
        }
        // If refreshedToken === token, do nothing (no state change needed)
      });
    }, 30000); // 30 seconds
    return () => clearInterval(refreshInterval);
  }, [token]);

  if (loading) {
    return (
      <>
        <AppealHead />
        <Header />
        <main>
          <section
            className="d-flex align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <output
                    className="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </output>
                  <p className="mt-3 text-muted">
                    Loading your appeal status...
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppealHead />
      <Header />
      <main>
        {!token && (
          <section
            className="py-5"
            style={{
              minHeight: "80vh",
              display: "flex",
              alignItems: "center",
              marginTop: "80px",
            }}
          >
            <div className="container position-relative">
              <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-9 text-center">
                  <h1>Ban Appeal</h1>
                  <div className="card mt-4">
                    <div className="card-body">
                      <p className="card-text">
                        At TripSit, we believe in second chances.
                      </p>
                      <p className="card-text">
                        If you feel you&apos;ve grown and addressed the issues
                        that resulted in your ban, we&apos;re open to
                        reconsidering.
                      </p>
                      <p className="card-text">
                        To appeal your ban, you will need a TripSit account
                        linked to the service you want to be unbanned from.
                      </p>
                      <p className="card-text">
                        For a majority of people: Go ahead and make a new
                        TripSit account below by logging in with your Discord
                        account. If you already have a TripSit account and need
                        to link to Discord, just log in with Discord.
                      </p>
                      <p className="card-text">
                        Remember to revisit this page to check the status of
                        your appeal in the future.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {loginFailed && (
                <div className="row justify-content-center mt-4">
                  <div className="col-xl-7 col-lg-9">
                    <div className="alert alert-danger mb-0" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>{" "}
                      We couldn&apos;t log you in. Please try logging in again.
                    </div>
                  </div>
                </div>
              )}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => void startLogin()}
                  className="btn-get-started scrollto"
                  style={{
                    borderRadius: "50px",
                    padding: "12px 30px",
                    fontSize: "16px",
                    fontWeight: "600",
                    textTransform: "none",
                    backgroundColor: "#2487ce",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Login with Discord
                </button>
              </div>
            </div>
          </section>
        )}

        {token && banCheckFailed && (
          <section className="py-5" style={{ marginTop: "80px" }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <h1>Ban Appeal</h1>
                  <div className="alert alert-danger mt-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{" "}
                    {`We couldn't check your ${appealHistoryFailed ? "appeal history" : "ban status"}. This is usually`}
                    temporary, so please try again. If it keeps failing, log in
                    again.
                  </div>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => void checkBan()}
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={() => void startLogin()}
                      className="btn btn-outline-light"
                    >
                      Log in again
                    </button>
                  </div>
                  {loginFailed && (
                    <p className="text-danger mt-3" role="alert">
                      We couldn&apos;t start login. Please try again.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "can_appeal" && (
          <section className="py-5" style={{ marginTop: "80px" }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h1 className="display-6">Submit Ban Appeal</h1>
                    <p className="lead text-muted">
                      Please answer all questions honestly and thoroughly. This
                      information helps our moderators understand your
                      situation.
                    </p>
                  </div>
                  <AppealForm
                    onSubmit={(data) => void submitAppeal(data)}
                    submitting={submitting}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "can_reappeal" && (
          <section className="py-5" style={{ marginTop: "80px" }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h1 className="display-6">Submit New Ban Appeal</h1>
                    <p className="lead text-muted">
                      You can submit a new appeal since enough time has passed
                      since your previous denial.
                    </p>
                  </div>

                  {/* Show previous appeal information */}
                  <div className="card mb-4 border-warning">
                    <div className="card-header bg-warning bg-opacity-10">
                      <h5 className="card-title mb-0">
                        <i className="bi bi-clock-history me-2"></i>Previous
                        Appeal
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <strong>Status:</strong>{" "}
                          {getStatusBadge(latestAppeal?.status)}
                        </div>
                        <div className="col-md-4">
                          <strong>Submitted:</strong>
                          <br />
                          <small className="text-muted">
                            {latestAppeal?.created_at
                              ? new Date(
                                  latestAppeal.created_at,
                                ).toLocaleString()
                              : "Unknown"}
                          </small>
                        </div>
                        {latestAppeal?.decided_at && (
                          <div className="col-md-4">
                            <strong>Decided:</strong>
                            <br />
                            <small className="text-muted">
                              {new Date(
                                latestAppeal.decided_at,
                              ).toLocaleString()}
                            </small>
                          </div>
                        )}
                      </div>
                      {latestAppeal?.response_message && (
                        <div className="mt-3">
                          <div className="alert alert-danger" role="alert">
                            <strong>Moderator Response:</strong>
                            <br />
                            <span style={{ whiteSpace: "pre-wrap" }}>
                              {latestAppeal.response_message}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <AppealForm
                    onSubmit={(data) => void submitAppeal(data)}
                    submitting={submitting}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "has_appeal" && (
          <section className="py-5" style={{ marginTop: "80px" }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h1 className="display-6">Your Appeal Status</h1>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h5 className="card-title mb-3">
                            Current Appeal Status
                          </h5>
                          <p className="mb-2">
                            <strong>Status:</strong>{" "}
                            {getStatusBadge(latestAppeal?.status ?? "RECEIVED")}
                          </p>
                          <p className="text-muted mb-1">
                            <small>
                              <strong>Submitted:</strong>{" "}
                              {latestAppeal?.created_at
                                ? new Date(
                                    latestAppeal.created_at,
                                  ).toLocaleString()
                                : "Unknown"}
                            </small>
                          </p>

                          {latestAppeal?.status === "RECEIVED" && (
                            <p className="text-muted mb-1">
                              <small>
                                <strong>Reminder available:</strong>{" "}
                                {reminderAvailableAt(
                                  latestAppeal,
                                ).toLocaleString()}
                              </small>
                            </p>
                          )}

                          {latestAppeal?.reminded_at && (
                            <p className="text-muted mb-0">
                              <small>
                                <strong>Last reminder:</strong>{" "}
                                {new Date(
                                  latestAppeal.reminded_at,
                                ).toLocaleString()}
                              </small>
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 text-md-end">
                          {latestAppeal?.status === "RECEIVED" &&
                            (() => {
                              const canRemind = canShowReminder(latestAppeal);
                              const buttonClass = `btn ${canRemind ? "btn-outline-primary" : "btn-outline-secondary"}`;

                              let buttonContent;
                              if (reminding) {
                                buttonContent = (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      aria-hidden="true"
                                    ></span>
                                    {"Sending..."}
                                  </>
                                );
                              } else if (canRemind) {
                                buttonContent = (
                                  <>
                                    <i className="bi bi-bell me-2"></i>Send
                                    Reminder
                                  </>
                                );
                              } else {
                                buttonContent = (
                                  <>
                                    <i className="bi bi-clock me-2"></i>Come
                                    back in 48 hours
                                  </>
                                );
                              }

                              return (
                                <button
                                  onClick={() => void sendReminder()}
                                  disabled={reminding || !canRemind}
                                  className={buttonClass}
                                >
                                  {buttonContent}
                                </button>
                              );
                            })()}
                        </div>
                      </div>

                      {latestAppeal !== null &&
                        [
                          latestAppeal.reason,
                          latestAppeal.solution,
                          latestAppeal.future,
                          latestAppeal.extra,
                        ].some(Boolean) && (
                          <div className="mt-4">
                            <div className="d-grid">
                              <button
                                className="btn btn-outline-info"
                                type="button"
                                aria-expanded={showAppealContent}
                                aria-controls="appealContent"
                                onClick={() =>
                                  setShowAppealContent((shown) => !shown)
                                }
                              >
                                <i className="bi bi-eye me-2"></i>View Your
                                Appeal Content
                              </button>
                            </div>
                            <div
                              className="mt-3"
                              id="appealContent"
                              hidden={!showAppealContent}
                            >
                              <div className="card card-body bg-light">
                                <h6 className="mb-3">Your Submitted Appeal</h6>

                                {latestAppeal.reason && (
                                  <div className="mb-3">
                                    <strong>
                                      Do you know why you were banned?
                                    </strong>
                                    <div className="bg-white p-2 rounded mt-1 border">
                                      {latestAppeal.reason}
                                    </div>
                                  </div>
                                )}

                                {latestAppeal.solution && (
                                  <div className="mb-3">
                                    <strong>
                                      Have you taken any steps to make amends?
                                    </strong>
                                    <div className="bg-white p-2 rounded mt-1 border">
                                      {latestAppeal.solution}
                                    </div>
                                  </div>
                                )}

                                {latestAppeal.future && (
                                  <div className="mb-3">
                                    <strong>
                                      What will you do to avoid repeating the
                                      behavior?
                                    </strong>
                                    <div className="bg-white p-2 rounded mt-1 border">
                                      {latestAppeal.future}
                                    </div>
                                  </div>
                                )}

                                {latestAppeal.extra && (
                                  <div className="mb-0">
                                    <strong>
                                      Anything else you&apos;d like to add?
                                    </strong>
                                    <div className="bg-white p-2 rounded mt-1 border">
                                      {latestAppeal.extra}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      {latestAppeal?.status === "RECEIVED" &&
                        !canShowReminder(latestAppeal) &&
                        !latestAppeal?.reminded_at && (
                          <div className="alert alert-info mt-3" role="alert">
                            <i className="bi bi-info-circle me-2"></i>You can
                            send a reminder 48 hours after submitting your
                            appeal.
                          </div>
                        )}

                      {remindMessage && (
                        <div
                          className={`alert ${remindMessage.includes("sent") ? "alert-success" : "alert-danger"} mt-3`}
                          role="alert"
                        >
                          {remindMessage}
                        </div>
                      )}
                    </div>
                  </div>

                  {latestAppeal?.status === "DENIED" && (
                    <div className="card border-danger mt-4">
                      <div className="card-header bg-danger bg-opacity-10 border-danger">
                        <h5 className="card-title text-danger mb-0">
                          <i className="bi bi-x-circle-fill me-2"></i>Appeal
                          Denied
                        </h5>
                      </div>
                      <div className="card-body">
                        {latestAppeal?.response_message && (
                          <p className="mb-3">
                            <strong>Moderator Response:</strong>
                            <br />
                            <span style={{ whiteSpace: "pre-wrap" }}>
                              {latestAppeal.response_message}
                            </span>
                          </p>
                        )}
                        <small className="text-muted">
                          <em>
                            You can submit a new appeal 3 months after this
                            decision.
                          </em>
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "not_banned" && (
          <section className="py-5" style={{ marginTop: "80px" }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  {latestAppeal ? (
                    <>
                      <div className="text-center mb-5">
                        <h1 className="display-6">Appeal History</h1>
                        <p className="lead text-success">
                          <i className="bi bi-check-circle me-2"></i>You are not
                          currently banned from the server.
                        </p>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h5 className="card-title mb-0">
                            Your Latest Appeal
                          </h5>
                        </div>
                        <div className="card-body">
                          <p className="mb-3">
                            <strong>Status:</strong>{" "}
                            {getStatusBadge(latestAppeal.status)}
                          </p>

                          {latestAppeal.status === "ACCEPTED" && (
                            <div className="alert alert-success" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                {"Appeal Accepted!"}
                              </h6>
                              {latestAppeal.response_message && (
                                <p className="mb-3">
                                  <strong>Moderator Response:</strong>{" "}
                                  <span style={{ whiteSpace: "pre-wrap" }}>
                                    {latestAppeal.response_message}
                                  </span>
                                </p>
                              )}
                              <a
                                href="https://discord.gg/TripSit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success btn-sm"
                              >
                                <i className="bi bi-discord me-2"></i>Join
                                Discord
                              </a>
                            </div>
                          )}

                          {latestAppeal.status === "DENIED" && (
                            <div className="alert alert-warning" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {"Appeal was Denied"}
                              </h6>
                              {latestAppeal.response_message && (
                                <p className="mb-2">
                                  <strong>Moderator Response:</strong>{" "}
                                  <span style={{ whiteSpace: "pre-wrap" }}>
                                    {latestAppeal.response_message}
                                  </span>
                                </p>
                              )}
                              <small className="text-muted">
                                <em>
                                  Note: Your ban may have been lifted separately
                                  from the appeal process.
                                </em>
                              </small>
                            </div>
                          )}

                          {latestAppeal.status === "RECEIVED" && (
                            <div className="alert alert-info" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-clock me-2"></i>Appeal Still
                                Pending
                              </h6>
                              <p className="mb-0">
                                Your appeal is still being reviewed by
                                moderators.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-5">
                        <h1 className="display-6">Not Banned</h1>
                      </div>

                      <div className="card">
                        <div className="card-body text-center">
                          <div className="mb-4">
                            <i
                              className="bi bi-check-circle-fill text-success"
                              style={{ fontSize: "3rem" }}
                            ></i>
                          </div>
                          <h5 className="card-title">You&apos;re all good!</h5>
                          <p className="card-text text-muted">
                            You are not currently banned from the server.
                            There&apos;s nothing to appeal!
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {message && (
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  className={`alert ${message.kind === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
                  role="alert"
                >
                  <i
                    className={`bi ${message.kind === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}
                  ></i>
                  {message.text}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setMessage(null)}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AppealPage;
