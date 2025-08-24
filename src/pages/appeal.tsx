// src/pages/appeal.tsx
import React, { useEffect, useState } from "react";
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

    // 1 month for production
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return decidedAt <= oneMonthAgo;
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

    // 24 hours for production
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    return createdAt <= twentyFourHoursAgo;
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

        {token && banStatus === "can_reappeal" && (
          <div>
            <h1>Submit New Ban Appeal</h1>
            
            {/* Show previous appeal information */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '5px' }}>
              <h3>Previous Appeal</h3>
              <p><strong>Status:</strong> {latestAppeal?.status}</p>
              <p><strong>Submitted:</strong> {new Date(latestAppeal?.created_at).toLocaleDateString()}</p>
              {latestAppeal?.decided_at && (
                <p><strong>Decided:</strong> {new Date(latestAppeal.decided_at).toLocaleDateString()}</p>
              )}
              {latestAppeal?.response_message && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
                  <p style={{ color: '#721c24', margin: 0 }}>
                    <strong>Moderator Response:</strong> {latestAppeal.response_message}
                  </p>
                </div>
              )}
            </div>

            <p style={{ marginBottom: '20px', color: '#6c757d' }}>
              Since your previous appeal was denied over a month ago, you can submit a new appeal.
            </p>

            <AppealForm onSubmit={submitAppeal} submitting={submitting} />
          </div>
        )}

        {token && banStatus === "has_appeal" && (
          <div>
            <h1>Your Appeal Status</h1>
            <p>You have an existing appeal. Status: {latestAppeal?.status || 'RECEIVED'}</p>
            
            {latestAppeal?.status === 'RECEIVED' && (
              <div>
                {canShowReminder(latestAppeal) && (
                  <button 
                    onClick={sendReminder} 
                    disabled={reminding}
                    style={{ marginTop: '10px', padding: '8px 16px' }}
                  >
                    {reminding ? 'Sending...' : 'Remind Moderators'}
                  </button>
                )}
                {!canShowReminder(latestAppeal) && (
                  <p style={{ marginTop: '10px', color: '#6c757d', fontSize: '14px' }}>
                    You can remind moderators 24 hours after submitting your appeal.
                  </p>
                )}
                {remindMessage && (
                  <p style={{ marginTop: '8px', color: remindMessage.includes('sent') ? 'green' : 'red' }}>
                    {remindMessage}
                  </p>
                )}
              </div>
            )}

            {latestAppeal?.status === 'ACCEPTED' && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px' }}>
                <h3 style={{ color: '#155724', margin: '0 0 10px 0' }}>Appeal Accepted!</h3>
                {latestAppeal?.response_message && (
                  <p style={{ color: '#155724', margin: 0 }}>
                    <strong>Reason:</strong> {latestAppeal.response_message}
                  </p>
                )}
              </div>
            )}

            {latestAppeal?.status === 'DENIED' && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
                <h3 style={{ color: '#721c24', margin: '0 0 10px 0' }}>Appeal Denied</h3>
                {latestAppeal?.response_message && (
                  <p style={{ color: '#721c24', margin: 0 }}>
                    <strong>Reason:</strong> {latestAppeal.response_message}
                  </p>
                )}
                <p style={{ color: '#721c24', margin: '10px 0 0 0', fontSize: '14px' }}>
                  <em>You can submit a new appeal one month after this decision.</em>
                </p>
              </div>
            )}
          </div>
        )}

        {token && banStatus === "not_banned" && (
          <div>
            {latestAppeal ? (
              <div>
                <h1>Appeal History</h1>
                <p>You are not currently banned from the server.</p>
                
                <div style={{ marginTop: '20px' }}>
                  <h3>Your Latest Appeal Status: {latestAppeal.status}</h3>
                  
                  {latestAppeal.status === 'ACCEPTED' && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px' }}>
                      <h4 style={{ color: '#155724', margin: '0 0 10px 0' }}>Appeal Accepted!</h4>
                      {latestAppeal.response_message && (
                        <p style={{ color: '#155724', margin: 0 }}>
                          <strong>Moderator Response:</strong> {latestAppeal.response_message}
                        </p>
                      )}
                    </div>
                  )}

                  {latestAppeal.status === 'DENIED' && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
                      <h4 style={{ color: '#721c24', margin: '0 0 10px 0' }}>Appeal was Denied</h4>
                      {latestAppeal.response_message && (
                        <p style={{ color: '#721c24', margin: 0 }}>
                          <strong>Moderator Response:</strong> {latestAppeal.response_message}
                        </p>
                      )}
                      <p style={{ color: '#721c24', margin: '10px 0 0 0', fontSize: '14px' }}>
                        <em>Note: Your ban may have been lifted separately from the appeal process.</em>
                      </p>
                    </div>
                  )}

                  {latestAppeal.status === 'RECEIVED' && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
                      <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>Appeal Still Pending</h4>
                      <p style={{ color: '#856404', margin: 0 }}>
                        Your appeal is still being reviewed by moderators.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h1>Not Banned</h1>
                <p>You are not currently banned from the server. There's nothing to appeal!</p>
              </div>
            )}
          </div>
        )}

        {message && <p>{message}</p>}
      </main>
      <Footer />
    </>
  );
};

export default AppealPage;
