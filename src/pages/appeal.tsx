// src/pages/appeal.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppealForm from "../components/AppealForm";
import { getLoginUrl, fetchUserInfo } from "../utils/keycloak";
import { Button } from "@nextui-org/react";

const AppealPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [banStatus, setBanStatus] = useState<"unknown" | "can_appeal" | "has_appeal" | "not_banned">("unknown");
  const [latestAppeal, setLatestAppeal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  // Fetch user info & ban status when we have a token
  useEffect(() => {
    if (token) {
      // First get the Discord ID
      fetch('/api/v2/keycloak/discord-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token })
      })
      .then(res => res.json())
      .then(discordData => {
        console.log('Discord data:', discordData);
        
        // Get user info and add Discord ID to it
        return fetchUserInfo(token).then(userInfo => {
          const combinedInfo = { ...userInfo, discord_id: discordData.discord_id };
          console.log('Combined user info:', combinedInfo);
          setUserInfo(combinedInfo);
          return checkBan(discordData.discord_id);
        });
      })
      .catch((err) => {
        console.error('Error getting Discord ID:', err);
        setLoading(false);
      });
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
        sessionStorage.setItem("kc_token", data.access_token);
        setToken(data.access_token);
      }
    } catch (e) {
      console.error("Token exchange failed", e);
    } finally {
      setLoading(false);
    }
  }

async function checkBan(discordId: string) {
  try {
    // First check if user is actually banned
    const banRes = await fetch(`/api/v2/users/${discordId}/banned`);
    if (!banRes.ok) {
      throw new Error('Failed to check ban status');
    }
    
    const banStatus = await banRes.json();
    console.log('Ban status:', banStatus);
    
    if (!banStatus.banned) {
      setBanStatus("not_banned");
      setLoading(false);
      return;
    }
    
    // If banned, check for existing appeals
    const appealsRes = await fetch(`/api/v2/appeals/${discordId}/latest`);
    if (appealsRes.ok) {
      const appeal = await appealsRes.json();
      console.log('Existing appeal:', appeal);
      setLatestAppeal(appeal);
      setBanStatus("has_appeal");
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
    if (!userInfo?.discord_id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v2/appeals/${userInfo.discord_id}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newAppealData: {
          ...data,
          userId: userInfo.discord_id,
          guild: '960606557622657026'
        } }),
      });
      if (res.ok) {
        setMessage("Your appeal has been submitted.");
        setBanStatus("unknown"); // hide form
      } else {
        setMessage("Failed to submit appeal. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setMessage("Error submitting appeal.");
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshTokenIfNeeded() {
  const savedToken = sessionStorage.getItem("kc_token");
  if (!savedToken) return null;

  // Decode token to check expiration (simple check)
  try {
    const tokenData = JSON.parse(atob(savedToken.split('.')[1]));
    const expiresAt = tokenData.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    // If token expires within 30 seconds, refresh it
    if (expiresAt - now < 30000) {
      console.log('Token expiring soon, clearing session...');
      sessionStorage.removeItem("kc_token");
      return null;
    }
    
    return savedToken;
  } catch (e) {
    console.error('Invalid token format');
    sessionStorage.removeItem("kc_token");
    return null;
  }
}

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main>
        {!token && (
          <section id="hero" className="d-flex align-items-center">
            <div
              className="container position-relative"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-9 text-center">
                  <h1>Ban Appeal</h1>
                  <h2>You must log in with Discord to submit an appeal.</h2>
                </div>
              </div>
              <div className="text-center">
                <a href={getLoginUrl()}>
                  <Button color="primary" className="btn-get-started scrollto">
                    Login with Discord
                  </Button>
                </a>
              </div>
            </div>
          </section>
        )}

        {token && banStatus === "can_appeal" && (
          <>
            <h1>Submit Ban Appeal</h1>
            <AppealForm onSubmit={submitAppeal} submitting={submitting} />
          </>
        )}

        {token && banStatus === "has_appeal" && (
          <div>
            <h1>Your Appeal Status</h1>
            <p>You have an existing appeal. Status: {latestAppeal?.status}</p>
          </div>
        )}

        {token && banStatus === "not_banned" && (
          <div>
            <h1>Not Banned</h1>
            <p>You are not currently banned from the server. There's nothing to appeal!</p>
          </div>
        )}

        {message && <p>{message}</p>}
      </main>
      <Footer />
    </>
  );
};

export default AppealPage;
