import { consumeLoginState, getLoginUrl, getPostLogoutUrl } from "../keycloak";

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
  it("binds login to a random, single-use state for this tab", () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const state = new URL(getLoginUrl()).searchParams.get("state");
    expect(state).toMatch(/^[a-f0-9]{64}$/);
    // Rendering another login link must not invalidate the first link.
    expect(new URL(getLoginUrl()).searchParams.get("state")).toBe(state);
    expect(consumeLoginState(state)).toBe(true);
    expect(consumeLoginState(state)).toBe(false);
    expect(new URL(getLoginUrl()).searchParams.get("state")).not.toBe(state);
  });

  it.each([null, "wrong-state"])(
    "rejects an uncorrelated callback (%s)",
    (state) => {
      env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
      getLoginUrl();
      expect(consumeLoginState(state)).toBe(false);
      expect(sessionStorage.getItem("kc_login_state")).toBeNull();
    },
  );

  it("rejects a callback after the pending login expires", () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const now = Date.now();
    const clock = jest.spyOn(Date, "now").mockReturnValue(now);
    const state = new URL(getLoginUrl()).searchParams.get("state");
    clock.mockReturnValue(now + 10 * 60 * 1000);
    expect(consumeLoginState(state)).toBe(false);
  });

  it.each([
    "invalid JSON",
    "null",
    "{}",
    '{"value":123}',
    '{"value":"short","expiresAt":9999999999999}',
  ])("rejects malformed pending state (%s)", (stored) => {
    sessionStorage.setItem("kc_login_state", stored);
    expect(consumeLoginState("anything")).toBe(false);
  });

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
