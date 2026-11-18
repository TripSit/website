// src/utils/keycloak.ts
// Builds the Keycloak login and logout URLs for the ban appeal flow.
//
// Next.js replaces each `process.env.NEXT_PUBLIC_*` expression with its value
// when `next build` runs, so in the browser these are fixed at build time.
// Changing them on a running container does nothing; they must be passed as
// build args (see the Dockerfile). Next.js only replaces the full
// `process.env.NAME` expression, so don't destructure or index process.env here.

import { envOrDefault } from "./envOrDefault";

const CLIENT_ID_MISSING =
  "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID was not set when this bundle was built. " +
  "Set it to the ban-appeals Keycloak client that TripBot redeems the code " +
  "with (KEYCLOAK_BAN_APPEALS_CLIENT_ID); otherwise the token exchange fails.";

function getKeycloakConfig() {
  return {
    realm: "TripSit",
    url: envOrDefault(
      process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      "https://auth.tripsit.me",
    ),
  };
}

// Keycloak binds an auth code to the client that asked for it, and TripBot's
// /api/v2/keycloak/token redeems it as the ban-appeals client. Any other client
// ID here makes every login fail after the user signs in, so there is no
// default. Login starts from an event handler, so a missing ID can fail locally
// with a retryable error instead of sending the user to an invalid login URL.
function getClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  if (!clientId) {
    if (process.env.NODE_ENV === "production") console.error(CLIENT_ID_MISSING);
    throw new Error(CLIENT_ID_MISSING);
  }
  return clientId;
}

const LOGIN_STATE_KEY = "kc_login_state";
const LOGIN_STATE_TTL = 10 * 60 * 1000;

interface PendingLogin {
  value: string;
  codeVerifier: string;
  expiresAt: number;
}

function readLoginState(): PendingLogin | null {
  try {
    const stored: unknown = JSON.parse(
      sessionStorage.getItem(LOGIN_STATE_KEY) ?? "null",
    );
    if (
      stored &&
      typeof stored === "object" &&
      "value" in stored &&
      typeof stored.value === "string" &&
      stored.value.length === 64 &&
      /^[a-f0-9]{64}$/.test(stored.value) &&
      "codeVerifier" in stored &&
      typeof stored.codeVerifier === "string" &&
      stored.codeVerifier.length === 43 &&
      /^[A-Za-z0-9_-]{43}$/.test(stored.codeVerifier) &&
      "expiresAt" in stored &&
      typeof stored.expiresAt === "number" &&
      stored.expiresAt > Date.now()
    ) {
      return {
        value: stored.value,
        codeVerifier: stored.codeVerifier,
        expiresAt: stored.expiresAt,
      };
    }
  } catch {
    // Missing or malformed pending login data never authorizes a callback.
  }
  return null;
}

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function pendingLoginState(): PendingLogin {
  const existing = readLoginState();
  if (existing) return existing;
  const value = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const pending = {
    value,
    codeVerifier: base64Url(crypto.getRandomValues(new Uint8Array(32))),
    expiresAt: Date.now() + LOGIN_STATE_TTL,
  };
  sessionStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(pending));
  return pending;
}

export function consumeLoginState(returnedState: string | null): string | null {
  const pending = readLoginState();
  sessionStorage.removeItem(LOGIN_STATE_KEY);
  return pending && returnedState === pending.value
    ? pending.codeVerifier
    : null;
}

export async function getLoginUrl(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Login must start in a browser.");
  }
  const config = getKeycloakConfig();
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: `${window.location.origin}/appeal`,
    response_type: "code",
    scope: "openid profile email",
  });
  const pending = pendingLoginState();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(pending.codeVerifier),
  );
  params.set("state", pending.value);
  params.set("code_challenge", base64Url(new Uint8Array(digest)));
  params.set("code_challenge_method", "S256");
  return `${config.url}/realms/${config.realm}/protocol/openid-connect/auth?${params.toString()}`;
}

export function getPostLogoutUrl(): string {
  const config = getKeycloakConfig();
  const params = new URLSearchParams({
    post_logout_redirect_uri:
      typeof window !== "undefined" ? window.location.origin : "",
    id_token_hint: sessionStorage.getItem("kc_id_token") ?? "",
  });
  return `${config.url}/realms/${config.realm}/protocol/openid-connect/logout?${params.toString()}`;
}
