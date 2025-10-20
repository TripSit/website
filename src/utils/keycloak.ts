// src/utils/keycloak.ts
// Simple Keycloak helper functions (placeholder values)

// Helper function to get config at runtime instead of build time
function getKeycloakConfig() {
  return {
    realm: "TripSit",
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://auth.tripsit.me",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "website",
    redirectUri:
      typeof window !== "undefined" ? `${window.location.origin}/appeal` : "",
  };
}

export function getLoginUrl(): string {
  const config = getKeycloakConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
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
