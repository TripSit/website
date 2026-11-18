import type { NextApiRequest, NextApiResponse } from "next";
import {
  assertStaffOrigin,
  clearStaffCookie,
  newStaffLogin,
  readStaffCookie,
  staffConfig,
  StaffError,
  staffFailure,
  tripbotRequest,
  writeStaffCookie,
} from "@/server/staff";

const reviewPage = "/dashboard/appeals";

function startLogin(res: NextApiResponse) {
  const login = newStaffLogin();
  writeStaffCookie(
    res,
    "login",
    { state: login.state, verifier: login.verifier },
    600,
  );
  return res.redirect(302, login.url);
}

function logout(req: NextApiRequest, res: NextApiResponse) {
  assertStaffOrigin(req);
  clearStaffCookie(res, "session");
  return res.redirect(303, reviewPage);
}

// The state and PKCE verifier saved by startLogin must match what Keycloak sent back.
function pendingVerifier(req: NextApiRequest) {
  const pending = readStaffCookie(req, "login");
  const { state, code, error } = req.query;
  const valid =
    typeof pending?.verifier === "string" &&
    typeof state === "string" &&
    state === pending.state &&
    typeof code === "string" &&
    !error;
  if (!valid) {
    throw new StaffError(
      400,
      "Staff sign-in expired or was cancelled. Start sign-in again.",
    );
  }
  return { code, verifier: pending.verifier as string };
}

async function exchangeCode(code: string, verifier: string) {
  const config = staffConfig();
  const response = await fetch(
    `${config.issuer}/protocol/openid-connect/token`,
    {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: `${config.origin}/api/staff/auth/callback`,
        code_verifier: verifier,
      }),
    },
  );
  if (!response.ok)
    throw new StaffError(401, "Staff sign-in failed. Start sign-in again.");
  const tokens = await response.json();
  const valid =
    typeof tokens.access_token === "string" &&
    Number.isInteger(tokens.expires_in) &&
    tokens.expires_in > 0;
  if (!valid) throw new StaffError(502, "Invalid sign-in response.");
  return {
    accessToken: tokens.access_token as string,
    expiresIn: tokens.expires_in as number,
  };
}

async function callback(req: NextApiRequest, res: NextApiResponse) {
  clearStaffCookie(res, "login");
  const cleared = String(res.getHeader("Set-Cookie"));
  const { code, verifier } = pendingVerifier(req);
  const { accessToken, expiresIn } = await exchangeCode(code, verifier);
  // Check live permission before a session exists, so a non-reviewer never holds one.
  const staff = await tripbotRequest(accessToken, "/session");
  if (staff?.canManageAppeals !== true)
    throw new StaffError(403, "Staff appeal permission is required.");
  writeStaffCookie(res, "session", { accessToken }, Math.min(expiresIn, 3600));
  res.setHeader("Set-Cookie", [cleared, String(res.getHeader("Set-Cookie"))]);
  return res.redirect(303, reviewPage);
}

// The review page reads this to explain why sign-in did not finish.
function signinOutcome(error: unknown) {
  if (!(error instanceof StaffError)) return "unavailable";
  if (error.status === 403) return "denied";
  if (error.status === 400 || error.status === 401) return "expired";
  return "unavailable";
}

function run(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  if (action === "logout") {
    if (req.method === "POST") return logout(req, res);
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  if (action === "login") return startLogin(res);
  if (action === "callback") return callback(req, res);
  return res.status(404).end();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  try {
    return await run(req, res);
  } catch (error) {
    if (req.query.action === "callback") {
      return res.redirect(303, `${reviewPage}?signin=${signinOutcome(error)}`);
    }
    return staffFailure(res, error);
  }
}
