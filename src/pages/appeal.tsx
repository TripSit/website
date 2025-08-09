// src/pages/appeal.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppealForm from "../components/AppealForm";
import { getLoginUrl, fetchUserInfo } from "../utils/keycloak";

const AppealPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [banStatus, setBanStatus] = useState<"unknown" | "not_banned" | "banned">("unknown");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Check if we already have a token in session storage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("kc_token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      // Look for ?code= from Keycloak redirect
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        exchangeCodeForToken(code);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Fetch user info & ban status when we have a token
  useEffect(() => {
    if (token) {
      fetchUserInfo(token)
        .then((info) => {
          setUserInfo(info);
          return checkBan(info.discord_id);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  async function exchangeCodeForToken(code: string) {
    try {
      const res = await fetch(`/api/auth/keycloak-token?code=${encodeURIComponent(code)}`);
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
    setBanStatus("banned");
    setLoading(false);
    /*
    try {
      const res = await fetch(`https://example.com/api/appeals/${discordId}/latest`);
      if (res.status === 404) {
        setBanStatus("not_banned");
      } else if (res.ok) {
        setBanStatus("banned");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
      */
  }

  async function submitAppeal(data: any) {
    if (!userInfo?.discord_id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`https://example.com/api/appeals/${userInfo.discord_id}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newAppealData: { ...data, userId: userInfo.discord_id } }),
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        {!token && (
          <div style={{ textAlign: "center" }}>
            <h1>Ban Appeal</h1>
            <p>You must log in with Discord to submit an appeal.</p>
            <a href={getLoginUrl()}>
              <button>Login with Discord</button>
            </a>
          </div>
        )}

        {token && banStatus === "not_banned" && (
          <p>You are not currently banned. There’s nothing to appeal.</p>
        )}

        {token && banStatus === "banned" && (
          <>
            <h1>Ban Appeal</h1>
            <AppealForm onSubmit={submitAppeal} submitting={submitting} />
          </>
        )}

        {message && <p>{message}</p>}
      </main>
      <Footer />
    </>
  );
};

export default AppealPage;
