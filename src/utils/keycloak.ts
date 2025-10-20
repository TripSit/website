// src/utils/keycloak.ts
// Simple Keycloak helper functions (placeholder values)

export const KEYCLOAK_CONFIG = {
  realm: "TripSit",
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
  redirectUri:
    typeof window !== "undefined" ? `${window.location.origin}/appeal` : "",
};

export function getLoginUrl(): string {
  const params = new URLSearchParams({
    client_id: KEYCLOAK_CONFIG.clientId,
    redirect_uri: KEYCLOAK_CONFIG.redirectUri,
    response_type: "code",
    scope: "openid profile email",
  });
  return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/auth?${params.toString()}`;
}

export function getPostLogoutUrl(): string {
  const params = new URLSearchParams({
    post_logout_redirect_uri:
      typeof window !== "undefined" ? window.location.origin : "",
    id_token_hint: sessionStorage.getItem("kc_id_token") || "",
  });
  return `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout?${params.toString()}`;
}
