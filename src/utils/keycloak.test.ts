import { getPostLogoutUrl, prepareKeycloakLogout } from "./keycloak";

describe("Keycloak logout", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("captures the ID token hint before removing session and legacy tokens", () => {
    sessionStorage.setItem("kc_id_token", "session-id-token");
    sessionStorage.setItem("kc_token", "session-access-token");
    sessionStorage.setItem("kc_refresh_token", "session-refresh-token");
    localStorage.setItem("kc_token", "legacy-access-token");
    localStorage.setItem("kc_refresh_token", "legacy-refresh-token");

    const url = new URL(prepareKeycloakLogout());
    expect(url.searchParams.get("id_token_hint")).toBe("session-id-token");

    for (const storage of [sessionStorage, localStorage]) {
      expect(storage.getItem("kc_token")).toBeNull();
      expect(storage.getItem("kc_refresh_token")).toBeNull();
      expect(storage.getItem("kc_id_token")).toBeNull();
    }
  });

  it("uses a legacy localStorage ID token when sessionStorage has none", () => {
    localStorage.setItem("kc_id_token", "legacy-id-token");
    const url = new URL(getPostLogoutUrl());
    expect(url.searchParams.get("id_token_hint")).toBe("legacy-id-token");
  });
});
