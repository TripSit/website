// src/utils/keycloak.ts
// Builds the Keycloak login and logout URLs for the ban appeal flow.
//
// Next.js replaces each `process.env.NEXT_PUBLIC_*` expression with its value
// when `next build` runs, so in the browser these are fixed at build time.
// Changing them on a running container does nothing; they must be passed as
// build args (see the Dockerfile). Next.js only replaces the full
// `process.env.NAME` expression, so don't destructure or index process.env here.

const CLIENT_ID_MISSING =
  "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID was not set when this bundle was built. " +
  "Set it to the ban-appeals Keycloak client that TripBot redeems the code " +
  "with (KEYCLOAK_BAN_APPEALS_CLIENT_ID); otherwise the token exchange fails.";

function getKeycloakConfig() {
  return {
    realm: "TripSit",
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://auth.tripsit.me",
  };
}

// Keycloak binds an auth code to the client that asked for it, and TripBot's
// /api/v2/keycloak/token redeems it as the ban-appeals client. Any other client
// ID here makes every login fail after the user signs in, so there is no
// default. Outside production a missing ID throws; in production it is logged,
// and Keycloak rejects the login request straight away.
function getClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  if (!clientId) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(CLIENT_ID_MISSING);
    }
    console.error(CLIENT_ID_MISSING);
    return "";
  }
  return clientId;
}

export function getLoginUrl(): string {
  const config = getKeycloakConfig();
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri:
      typeof window !== "undefined" ? `${window.location.origin}/appeal` : "",
    response_type: "code",
    scope: "openid profile email",
  });
  return `${config.url}/realms/${config.realm}/protocol/openid-connect/auth?${params.toString()}`;
}

export function getPostLogoutUrl(): string {
  const config = getKeycloakConfig();
  const params = new URLSearchParams({
    post_logout_redirect_uri:
      typeof window !== "undefined" ? window.location.origin : "",
    id_token_hint: sessionStorage.getItem("kc_id_token") || "",
  });
  return `${config.url}/realms/${config.realm}/protocol/openid-connect/logout?${params.toString()}`;
}
