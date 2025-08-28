import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppealForm from "../components/AppealForm";
import { getLoginUrl } from "../utils/keycloak";
import { Button } from "@nextui-org/react";

const AppealPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [banStatus, setBanStatus] = useState<"unknown" | "can_appeal" | "has_appeal" | "not_banned" | "can_reappeal">("unknown");
  const [latestAppeal, setLatestAppeal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reminding, setReminding] = useState(false);
  const [remindMessage, setRemindMessage] = useState<string | null>(null);
  
  // Use useRef to store the interval ID so we can clear it
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we already have a token in session storage, also handle refreshing tokens.
  useEffect(() => {
    const checkToken = async () => {
      const validToken = await refreshTokenIfNeeded();
      if (validToken) {
        setToken(validToken);
      } else {
        // Look for auth code for fresh login
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          exchangeCodeForToken(code);
        } else {
          setLoading(false);
        }
      }
    };
    
    checkToken();
  }, []);

  // Set up background token refresh when we have a token
  useEffect(() => {
    if (token) {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      // Set up new interval to refresh every 30 seconds
      refreshIntervalRef.current = setInterval(async () => {
        console.log('Background token refresh check...');
        const refreshedToken = await refreshTokenIfNeeded();
        if (refreshedToken && refreshedToken !== token) {
          console.log('Token refreshed in background');
          setToken(refreshedToken);
        } else if (!refreshedToken) {
          console.log('Background refresh failed, clearing token');
          setToken(null);
          clearInterval(refreshIntervalRef.current!);
        }
      }, 30000); // 30 seconds

      console.log('Background token refresh started (every 30 seconds)');
    }

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        console.log('Clearing background token refresh');
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [token]);

  // Fetch ban status when we have a token
  useEffect(() => {
    if (token) {
      checkBan();
    }
  }, [token]);

  async function exchangeCodeForToken(code: string) {
    try {
      const res = await fetch('/api/v2/keycloak/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.access_token) {
        // Store both tokens
        sessionStorage.setItem("kc_token", data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("kc_refresh_token", data.refresh_token);
        }
        setToken(data.access_token);
        
        // Clean up the URL by removing the query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error("Token exchange failed", e);
    } finally {
      setLoading(false);
    }
  }

  function canReappeal(appeal: any): boolean {
    if (!appeal || appeal.status !== 'DENIED') return false;
    
    const decidedAt = new Date(appeal.decided_at);

    // 30 seconds for development
    if (process.env.NODE_ENV === 'development') {
      const thirtySecondsAgo = new Date();
      thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
      return decidedAt <= thirtySecondsAgo;
    }

    // 3 months for production
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    return decidedAt <= threeMonthsAgo;
  }

  function canShowReminder(appeal: any): boolean {
    if (!appeal || appeal.status !== 'RECEIVED') return false;
    
    const createdAt = new Date(appeal.created_at);

    // 30 seconds for development
    if (process.env.NODE_ENV === 'development') {
      const thirtySecondsAgo = new Date();
      thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
      return createdAt <= thirtySecondsAgo;
    }

    // 48 hours for production
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
    return createdAt <= fortyEightHoursAgo;
  }

  async function checkBan() {
    try {
      // Check ban status (no Discord ID needed - comes from token)
      const banRes = await fetch('/api/v2/users/banned', {
        headers: await getAuthHeaders()
      });
      
      if (!banRes.ok) {
        throw new Error('Failed to check ban status');
      }
      
      const banStatus = await banRes.json();
      console.log('Ban status:', banStatus);
      
      if (!banStatus.banned) {
        setBanStatus("not_banned");
        
        // Even if not banned, check for appeal history
        const appealsRes = await fetch('/api/v2/appeals/latest', {
          headers: await getAuthHeaders()
        });
        
        if (appealsRes.ok) {
          const appeal = await appealsRes.json();
          console.log('Appeal history found:', appeal);
          setLatestAppeal(appeal);
        }
        
        setLoading(false);
        return;
      }
      
      // If banned, check for existing appeals
      const appealsRes = await fetch('/api/v2/appeals/latest', {
        headers: await getAuthHeaders()
      });
      
      if (appealsRes.ok) {
        const appeal = await appealsRes.json();
        console.log('Existing appeal:', appeal);
        setLatestAppeal(appeal);
        
        // Check if this appeal is for the current ban
        if (appeal.status === 'ACCEPTED') {
          // Previous appeal was accepted, they can make a new appeal for current ban
          setBanStatus("can_appeal");
        } else if (appeal.status === 'DENIED') {
          // Check if enough time has passed to reappeal
          if (canReappeal(appeal)) {
            setBanStatus("can_reappeal"); // Show reappeal UI with previous appeal info
          } else {
            setBanStatus("has_appeal"); // Show denial message and waiting period
          }
        } else {
          // Appeal is still pending (RECEIVED status)
          setBanStatus("has_appeal");
        }
      } else if (appealsRes.status === 404) {
        console.log('No appeals found - user can create one');
        setBanStatus("can_appeal");
      } else {
        setBanStatus("unknown");
      }
    } catch (e) {
      console.error(e);
      setBanStatus("unknown");
    } finally {
      setLoading(false);
    }
  }

  async function submitAppeal(data: any) {
    setSubmitting(true);
    try {
      const headers = await getAuthHeaders();

      const res = await fetch('/api/v2/appeals/create', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setMessage("Your appeal has been submitted.");
        setBanStatus("has_appeal");
        // Refresh to get the new appeal
        checkBan();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await res.json();
        setMessage(`Failed to submit appeal: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message === 'No valid token available') {
        setMessage("Session expired. Please refresh the page and log in again.");
      } else {
        setMessage("Error submitting appeal.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshTokenIfNeeded() {
    const savedToken = sessionStorage.getItem("kc_token");
    const refreshToken = sessionStorage.getItem("kc_refresh_token");
    
    if (!savedToken) return null;

    try {
      const tokenData = JSON.parse(atob(savedToken.split('.')[1]));
      const expiresAt = tokenData.exp * 1000;
      const now = Date.now();
      
      // If token expires within 60 seconds, refresh it
      if (expiresAt - now < 60000) {
        if (refreshToken) {
          console.log('Refreshing token...');
          
          const refreshRes = await fetch('/api/v2/keycloak/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
          });
          
          if (refreshRes.ok) {
            const newTokens = await refreshRes.json();
            sessionStorage.setItem("kc_token", newTokens.access_token);
            if (newTokens.refresh_token) {
              sessionStorage.setItem("kc_refresh_token", newTokens.refresh_token);
            }
            console.log('Token refreshed successfully');
            return newTokens.access_token;
          } else {
            console.log('Token refresh failed, clearing session');
            sessionStorage.removeItem("kc_token");
            sessionStorage.removeItem("kc_refresh_token");
            return null;
          }
        } else {
          console.log('No refresh token available, clearing session');
          sessionStorage.removeItem("kc_token");
          return null;
        }
      }
      
      return savedToken;
    } catch (e) {
      console.error('Token validation failed:', e);
      sessionStorage.removeItem("kc_token");
      sessionStorage.removeItem("kc_refresh_token");
      return null;
    }
  }

  async function getAuthHeaders() {
    const validToken = await refreshTokenIfNeeded();
    
    if (!validToken) {
      throw new Error('No valid token available');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    };
  }

  async function sendReminder() {
    setReminding(true);
    setRemindMessage(null);
    
    try {
      const res = await fetch('/api/v2/appeals/remind', {
        method: 'POST',
        headers: await getAuthHeaders(),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setRemindMessage(data.message);
        // Refresh the appeal data to get updated reminded_at
        checkBan();
      } else {
        setRemindMessage(data.error);
      }
    } catch (e) {
      console.error(e);
      setRemindMessage('Failed to send reminder');
    } finally {
      setReminding(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge bg-success fs-6">Accepted</span>;
      case 'DENIED':
        return <span className="badge bg-danger fs-6">Denied</span>;
      case 'RECEIVED':
        return <span className="badge bg-warning text-dark fs-6">Under Review</span>;
      default:
        return <span className="badge bg-secondary fs-6">{status}</span>;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <section className="d-flex align-items-center" style={{ minHeight: '60vh' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading your appeal status...</p>
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
      <Header />
      <main>
        {!token && (
          <section className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
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
                        If you feel you've grown and addressed the issues
                        that resulted in your ban, we're open to
                        reconsidering.
                      </p>
                      <p className="card-text">
                        To appeal your ban, you will need a TripSit account
                        linked to the service you want to be unbanned from.
                      </p>
                      <p className="card-text">
                        For a majority of people: Go ahead and make a new
                        TripSit account below by logging in with your Discord
                        account. If you already have a TripSit account and
                        need to link to Discord, just log in with Discord.
                      </p>
                      <p className="card-text">
                        Remember to revisit this page to check the status of
                        your appeal in the future.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <a href={getLoginUrl()} className="btn-get-started-wrapper">
                  <Button 
                    color="primary" 
                    size="lg"
                    className="btn-get-started scrollto"
                    style={{ 
                      borderRadius: '50px',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'none'
                    }}
                  >
                    Login with Discord
                  </Button>
                </a>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "can_appeal" && (
          <section className="py-5" style={{ marginTop: '80px' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h1 className="display-6">Submit Ban Appeal</h1>
                    <p className="lead text-muted">
                      Please answer all questions honestly and thoroughly. This information helps our moderators understand your situation.
                    </p>
                  </div>
                  <AppealForm onSubmit={submitAppeal} submitting={submitting} />
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "can_reappeal" && (
          <section className="py-5" style={{ marginTop: '80px' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h1 className="display-6">Submit New Ban Appeal</h1>
                    <p className="lead text-muted">
                      You can submit a new appeal since enough time has passed since your previous denial.
                    </p>
                  </div>
                  
                  {/* Show previous appeal information */}
                  <div className="card mb-4 border-warning">
                    <div className="card-header bg-warning bg-opacity-10">
                      <h5 className="card-title mb-0">
                        <i className="bi bi-clock-history me-2"></i>Previous Appeal
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <strong>Status:</strong> {getStatusBadge(latestAppeal?.status)}
                        </div>
                        <div className="col-md-4">
                          <strong>Submitted:</strong><br />
                          <small className="text-muted">{new Date(latestAppeal?.created_at).toLocaleDateString()}</small>
                        </div>
                        {latestAppeal?.decided_at && (
                          <div className="col-md-4">
                            <strong>Decided:</strong><br />
                            <small className="text-muted">{new Date(latestAppeal.decided_at).toLocaleDateString()}</small>
                          </div>
                        )}
                      </div>
                      {latestAppeal?.response_message && (
                        <div className="mt-3">
                          <div className="alert alert-danger" role="alert">
                            <strong>Moderator Response:</strong><br />
                            {latestAppeal.response_message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <AppealForm onSubmit={submitAppeal} submitting={submitting} />
                </div>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "has_appeal" && (
          <section className="py-5" style={{ marginTop: '80px' }}>
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
                          <h5 className="card-title mb-3">Current Appeal Status</h5>
                          <p className="mb-2">
                            <strong>Status:</strong> {getStatusBadge(latestAppeal?.status || 'RECEIVED')}
                          </p>
                          <p className="text-muted mb-0">
                            <small>
                              Submitted: {latestAppeal?.created_at ? new Date(latestAppeal.created_at).toLocaleDateString() : 'Unknown'}
                            </small>
                          </p>
                        </div>
                        <div className="col-md-4 text-md-end">
                          {latestAppeal?.status === 'RECEIVED' && canShowReminder(latestAppeal) && (
                            <button 
                              onClick={sendReminder} 
                              disabled={reminding}
                              className="btn btn-outline-primary"
                            >
                              {reminding ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-bell me-2"></i>
                                  Remind Moderators
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {latestAppeal?.status === 'RECEIVED' && !canShowReminder(latestAppeal) && (
                        <div className="alert alert-info mt-3" role="alert">
                          <i className="bi bi-info-circle me-2"></i>
                          You can remind moderators 24 hours after submitting your appeal.
                        </div>
                      )}

                      {remindMessage && (
                        <div className={`alert ${remindMessage.includes('sent') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                          {remindMessage}
                        </div>
                      )}
                    </div>
                  </div>

                  {latestAppeal?.status === 'ACCEPTED' && (
                    <div className="card border-success mt-4">
                      <div className="card-header bg-success bg-opacity-10 border-success">
                        <h5 className="card-title text-success mb-0">
                          <i className="bi bi-check-circle-fill me-2"></i>Appeal Accepted!
                        </h5>
                      </div>
                      <div className="card-body">
                        {latestAppeal?.response_message && (
                          <p className="mb-0">
                            <strong>Moderator Response:</strong><br />
                            {latestAppeal.response_message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {latestAppeal?.status === 'DENIED' && (
                    <div className="card border-danger mt-4">
                      <div className="card-header bg-danger bg-opacity-10 border-danger">
                        <h5 className="card-title text-danger mb-0">
                          <i className="bi bi-x-circle-fill me-2"></i>Appeal Denied
                        </h5>
                      </div>
                      <div className="card-body">
                        {latestAppeal?.response_message && (
                          <p className="mb-3">
                            <strong>Moderator Response:</strong><br />
                            {latestAppeal.response_message}
                          </p>
                        )}
                        <small className="text-muted">
                          <em>You can submit a new appeal one month after this decision.</em>
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
          <section className="py-5" style={{ marginTop: '80px' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  {latestAppeal ? (
                    <>
                      <div className="text-center mb-5">
                        <h1 className="display-6">Appeal History</h1>
                        <p className="lead text-success">
                          <i className="bi bi-check-circle me-2"></i>
                          You are not currently banned from the server.
                        </p>
                      </div>
                      
                      <div className="card">
                        <div className="card-header">
                          <h5 className="card-title mb-0">Your Latest Appeal</h5>
                        </div>
                        <div className="card-body">
                          <p className="mb-3">
                            <strong>Status:</strong> {getStatusBadge(latestAppeal.status)}
                          </p>
                          
                          {latestAppeal.status === 'ACCEPTED' && (
                            <div className="alert alert-success" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-check-circle-fill me-2"></i>Appeal Accepted!
                              </h6>
                              {latestAppeal.response_message && (
                                <p className="mb-0">
                                  <strong>Moderator Response:</strong> {latestAppeal.response_message}
                                </p>
                              )}
                            </div>
                          )}

                          {latestAppeal.status === 'DENIED' && (
                            <div className="alert alert-warning" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>Appeal was Denied
                              </h6>
                              {latestAppeal.response_message && (
                                <p className="mb-2">
                                  <strong>Moderator Response:</strong> {latestAppeal.response_message}
                                </p>
                              )}
                              <small className="text-muted">
                                <em>Note: Your ban may have been lifted separately from the appeal process.</em>
                              </small>
                            </div>
                          )}

                          {latestAppeal.status === 'RECEIVED' && (
                            <div className="alert alert-info" role="alert">
                              <h6 className="alert-heading">
                                <i className="bi bi-clock me-2"></i>Appeal Still Pending
                              </h6>
                              <p className="mb-0">
                                Your appeal is still being reviewed by moderators.
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
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                          </div>
                          <h5 className="card-title">You're all good!</h5>
                          <p className="card-text text-muted">
                            You are not currently banned from the server. There's nothing to appeal!
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
                <div className={`alert ${message.includes('submitted') || message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                  {message.includes('submitted') && <i className="bi bi-check-circle-fill me-2"></i>}
                  {message.includes('Failed') && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                  {message}
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setMessage(null)}></button>
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
