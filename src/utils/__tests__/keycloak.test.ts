import { getLoginUrl, getPostLogoutUrl } from "../keycloak";

// NODE_ENV is typed read-only; tests need to switch it.
const env = process.env as Record<string, string | undefined>;
const saved = {
  NODE_ENV: env.NODE_ENV,
  NEXT_PUBLIC_KEYCLOAK_URL: env.NEXT_PUBLIC_KEYCLOAK_URL,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

function restore(name: keyof typeof saved) {
  if (saved[name] === undefined) delete env[name];
  else env[name] = saved[name];
}

beforeEach(() => {
  delete env.NEXT_PUBLIC_KEYCLOAK_URL;
  delete env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
});

afterEach(() => {
  restore("NODE_ENV");
  restore("NEXT_PUBLIC_KEYCLOAK_URL");
  restore("NEXT_PUBLIC_KEYCLOAK_CLIENT_ID");
  jest.restoreAllMocks();
  sessionStorage.clear();
});

test.each(["", "test-id-token"])(
  "builds a logout URL with token hint %p",
  (hint) => {
    if (hint) sessionStorage.setItem("kc_id_token", hint);
    const url = new URL(getPostLogoutUrl());
    expect(url.pathname).toBe("/realms/TripSit/protocol/openid-connect/logout");
    expect(url.searchParams.get("post_logout_redirect_uri")).toBe(
      window.location.origin,
    );
    expect(url.searchParams.get("id_token_hint")).toBe(hint);
  },
);

describe("getLoginUrl", () => {
  it("asks Keycloak for a code as the configured client", () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const url = new URL(getLoginUrl());

    expect(url.origin + url.pathname).toBe(
      "https://auth.tripsit.me/realms/TripSit/protocol/openid-connect/auth",
    );
    expect(url.searchParams.get("client_id")).toBe("ban-appeals");
    expect(url.searchParams.get("redirect_uri")).toBe(
      `${window.location.origin}/appeal`,
    );
    expect(url.searchParams.get("response_type")).toBe("code");
  });

  it("uses NEXT_PUBLIC_KEYCLOAK_URL when it is set", () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    env.NEXT_PUBLIC_KEYCLOAK_URL = "https://auth.example.test";

    expect(getLoginUrl()).toMatch(
      /^https:\/\/auth\.example\.test\/realms\/TripSit\//,
    );
  });

  it("throws outside production when the client ID is missing", () => {
    expect(() => getLoginUrl()).toThrow(/NEXT_PUBLIC_KEYCLOAK_CLIENT_ID/);
  });

  it("never falls back to the old 'website' client in production", () => {
    env.NODE_ENV = "production";
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    const url = new URL(getLoginUrl());

    expect(url.searchParams.get("client_id")).toBe("");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_KEYCLOAK_CLIENT_ID"),
    );
  });
});
