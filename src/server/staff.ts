import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export class StaffError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "StaffError";
  }
}

type CookieRequest = Pick<NextApiRequest, "cookies">;

export function staffConfig() {
  const {
    STAFF_SITE_ORIGIN: site,
    STAFF_KEYCLOAK_ISSUER: issuer,
    STAFF_KEYCLOAK_CLIENT_ID: clientId,
    STAFF_KEYCLOAK_CLIENT_SECRET: clientSecret,
    STAFF_COOKIE_SECRET: secret,
    TRIPBOT_API_URL: bot,
  } = process.env;
  if (
    !site ||
    !issuer ||
    !clientId ||
    !clientSecret ||
    !secret ||
    !bot ||
    !/^[a-f0-9]{64}$/i.test(secret)
  ) {
    throw new StaffError(503, "Staff review is not configured.");
  }
  const origin = new URL(site).origin;
  for (const value of [site, issuer, bot]) {
    const url = new URL(value);
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.protocol !== "https:" &&
        !(
          process.env.NODE_ENV !== "production" &&
          url.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(url.hostname)
        ))
    ) {
      throw new StaffError(
        503,
        "Staff service URLs require HTTPS (localhost HTTP is allowed in development).",
      );
    }
  }
  return {
    origin,
    issuer: issuer.replace(/\/$/, ""),
    clientId,
    clientSecret,
    key: Buffer.from(secret, "hex"),
    botUrl: bot.replace(/\/$/, ""),
    secure: new URL(origin).protocol === "https:",
  };
}

function cookieName(kind: string, secure = staffConfig().secure) {
  return `${secure ? "__Host-" : ""}staff_${kind}`;
}

function cookieAttributes(seconds: number, secure: boolean) {
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure ? "; Secure" : ""}`;
}

// Tokens are encrypted, HttpOnly, and never included in page props or web storage.
export function writeStaffCookie(
  res: NextApiResponse,
  kind: string,
  data: object,
  seconds: number,
) {
  const { key, secure } = staffConfig();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(kind));
  const encrypted = Buffer.concat([
    cipher.update(
      JSON.stringify({ ...data, expires: Date.now() + seconds * 1000 }),
    ),
    cipher.final(),
  ]);
  const value = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url",
  );
  if (value.length > 3800)
    throw new StaffError(502, "The staff session token is too large.");
  res.setHeader(
    "Set-Cookie",
    `${cookieName(kind, secure)}=${value}; ${cookieAttributes(seconds, secure)}`,
  );
}

export function clearStaffCookie(res: NextApiResponse, kind: string) {
  const { secure } = staffConfig();
  res.setHeader(
    "Set-Cookie",
    `${cookieName(kind, secure)}=; ${cookieAttributes(0, secure)}`,
  );
}

export function readStaffCookie(
  req: CookieRequest,
  kind: string,
): Record<string, unknown> | null {
  const value = req.cookies[cookieName(kind)];
  if (!value) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    const decipher = createDecipheriv(
      "aes-256-gcm",
      staffConfig().key,
      bytes.subarray(0, 12),
    );
    decipher.setAAD(Buffer.from(kind));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const data = JSON.parse(
      Buffer.concat([
        decipher.update(bytes.subarray(28)),
        decipher.final(),
      ]).toString(),
    );
    return data && typeof data.expires === "number" && data.expires > Date.now()
      ? data
      : null;
  } catch {
    return null;
  }
}

export function assertStaffOrigin(req: NextApiRequest) {
  if (req.headers.origin !== staffConfig().origin)
    throw new StaffError(403, "Invalid request origin.");
}

export function staffToken(req: CookieRequest): string {
  const session = readStaffCookie(req, "session");
  if (typeof session?.accessToken !== "string")
    throw new StaffError(401, "Sign in to staff review.");
  return session.accessToken;
}

export async function tripbotRequest(
  token: string,
  path: string,
  init: RequestInit = {},
) {
  let response: Response;
  try {
    response = await fetch(
      `${staffConfig().botUrl}/api/v2/appeals/staff${path}`,
      {
        ...init,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch {
    throw new StaffError(503, "TripBot is unavailable. Please try again.");
  }
  if (!response.ok) {
    const messages: Record<number, string> = {
      401: "Your staff session expired. Sign in again.",
      403: "You do not have permission to review appeals.",
      404: "Appeal or staff API not found.",
      409: "This appeal changed or was already reviewed. Refresh the queue.",
      429: "Too many requests. Please wait a minute.",
    };
    throw new StaffError(
      response.status >= 500 ? 503 : response.status,
      messages[response.status] ?? "TripBot could not complete the request.",
    );
  }
  return response.json();
}

export function newStaffLogin() {
  const config = staffConfig();
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${config.origin}/api/staff/auth/callback`,
    response_type: "code",
    scope: "openid profile",
    state,
    code_challenge_method: "S256",
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
  });
  return {
    state,
    verifier,
    url: `${config.issuer}/protocol/openid-connect/auth?${params}`,
  };
}

export function staffFailure(res: NextApiResponse, error: unknown) {
  const known = error instanceof StaffError;
  res.status(known ? error.status : 503).json({
    error: known ? error.message : "Staff review is temporarily unavailable.",
  });
}
