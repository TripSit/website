import type { NextApiRequest, NextApiResponse } from "next";

const KEYCLOAK_URL =
  "https://auth.tripsit.me/realms/TripSit/protocol/openid-connect/token";
const CLIENT_ID = "redacted";
const CLIENT_SECRET = "redacted"; // optional if public client
const REDIRECT_URI = "http://localhost:3000/appeal"; // match Keycloak config

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const tokenRes = await fetch(KEYCLOAK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        ...(CLIENT_SECRET ? { client_secret: CLIENT_SECRET } : {}),
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Keycloak token error:", errText);
      return res
        .status(tokenRes.status)
        .json({ error: "Failed to fetch token" });
    }

    const tokenData = await tokenRes.json();
    return res.status(200).json(tokenData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
