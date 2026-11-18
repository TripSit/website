import { webcrypto } from "node:crypto";
import { TextEncoder } from "node:util";
import { consumeLoginState, getLoginUrl, getPostLogoutUrl } from "../keycloak";

const originalSubtle = Object.getOwnPropertyDescriptor(crypto, "subtle");
const originalTextEncoder = Object.getOwnPropertyDescriptor(
  globalThis,
  "TextEncoder",
);

beforeAll(() => {
  Object.defineProperty(crypto, "subtle", {
    configurable: true,
    value: webcrypto.subtle,
  });
  Object.defineProperty(globalThis, "TextEncoder", {
    configurable: true,
    value: TextEncoder,
  });
});

afterAll(() => {
  if (originalSubtle) Object.defineProperty(crypto, "subtle", originalSubtle);
  else Reflect.deleteProperty(crypto, "subtle");
  if (originalTextEncoder)
    Object.defineProperty(globalThis, "TextEncoder", originalTextEncoder);
  else Reflect.deleteProperty(globalThis, "TextEncoder");
});

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
  it("binds login to a random, single-use state and verifier for this tab", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const url = new URL(await getLoginUrl());
    const state = url.searchParams.get("state");
    const pending = JSON.parse(
      sessionStorage.getItem("kc_login_state") ?? "{}",
    );
    expect(pending.codeVerifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toMatch(
      /^[A-Za-z0-9_-]{43}$/,
    );
    expect(url.searchParams.has("code_verifier")).toBe(false);
    expect(url.href).not.toContain(pending.codeVerifier);
    expect(state).toMatch(/^[a-f0-9]{64}$/);
    // Rendering another login link must not invalidate the first link.
    expect(new URL(await getLoginUrl()).searchParams.get("state")).toBe(state);
    expect(consumeLoginState(state)).toBe(pending.codeVerifier);
    expect(consumeLoginState(state)).toBeNull();
    expect(new URL(await getLoginUrl()).searchParams.get("state")).not.toBe(
      state,
    );
  });

  it("matches the RFC 7636 S256 challenge example", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    sessionStorage.setItem(
      "kc_login_state",
      JSON.stringify({
        value: "a".repeat(64),
        codeVerifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
        expiresAt: Date.now() + 60000,
      }),
    );
    const url = new URL(await getLoginUrl());
    expect(url.searchParams.get("code_challenge")).toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });

  it.each([
    undefined,
    null,
    123,
    "short",
    `${"v".repeat(43)}\n`,
    `${"v".repeat(42)}+`,
  ])(
    "rejects pending login data without its original verifier (%s)",
    (codeVerifier) => {
      const state = "a".repeat(64);
      sessionStorage.setItem(
        "kc_login_state",
        JSON.stringify({
          value: state,
          codeVerifier,
          expiresAt: Date.now() + 60000,
        }),
      );
      expect(consumeLoginState(state)).toBeNull();
      expect(sessionStorage.getItem("kc_login_state")).toBeNull();
    },
  );

  it("fails closed when SHA-256 generation fails", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    jest
      .spyOn(crypto.subtle, "digest")
      .mockRejectedValue(new Error("Crypto unavailable"));
    await expect(getLoginUrl()).rejects.toThrow("Crypto unavailable");
  });

  it.each([null, "wrong-state"])(
    "rejects an uncorrelated callback (%s)",
    async (state) => {
      env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
      await getLoginUrl();
      expect(consumeLoginState(state)).toBeNull();
      expect(sessionStorage.getItem("kc_login_state")).toBeNull();
    },
  );

  it("rejects a callback after the pending login expires", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const now = Date.now();
    const clock = jest.spyOn(Date, "now").mockReturnValue(now);
    const state = new URL(await getLoginUrl()).searchParams.get("state");
    clock.mockReturnValue(now + 10 * 60 * 1000);
    expect(consumeLoginState(state)).toBeNull();
  });

  it.each([
    "invalid JSON",
    "null",
    "{}",
    '{"value":123}',
    '{"value":"short","expiresAt":9999999999999}',
  ])("rejects malformed pending state (%s)", (stored) => {
    sessionStorage.setItem("kc_login_state", stored);
    expect(consumeLoginState("anything")).toBeNull();
  });

  it("asks Keycloak for a code as the configured client", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    const url = new URL(await getLoginUrl());

    expect(url.origin + url.pathname).toBe(
      "https://auth.tripsit.me/realms/TripSit/protocol/openid-connect/auth",
    );
    expect(url.searchParams.get("client_id")).toBe("ban-appeals");
    expect(url.searchParams.get("redirect_uri")).toBe(
      `${window.location.origin}/appeal`,
    );
    expect(url.searchParams.get("response_type")).toBe("code");
  });

  it("uses NEXT_PUBLIC_KEYCLOAK_URL when it is set", async () => {
    env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = "ban-appeals";
    env.NEXT_PUBLIC_KEYCLOAK_URL = "https://auth.example.test";

    expect(await getLoginUrl()).toMatch(
      /^https:\/\/auth\.example\.test\/realms\/TripSit\//,
    );
  });

  it("rejects outside production when the client ID is missing", async () => {
    await expect(getLoginUrl()).rejects.toThrow(
      /NEXT_PUBLIC_KEYCLOAK_CLIENT_ID/,
    );
  });

  it("never redirects to an invalid client in production", async () => {
    env.NODE_ENV = "production";
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(getLoginUrl()).rejects.toThrow(
      /NEXT_PUBLIC_KEYCLOAK_CLIENT_ID/,
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_KEYCLOAK_CLIENT_ID"),
    );
  });
});
