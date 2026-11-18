/** @jest-environment node */
import { createHash } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  newStaffLogin,
  readStaffCookie,
  writeStaffCookie,
  staffConfig,
  staffToken,
  tripbotRequest,
  assertStaffOrigin,
} from "../staff";
import handler from "@/pages/api/staff/[...path]";
import authHandler from "@/pages/api/staff/auth/[action]";

const environment = { ...process.env };
function response() {
  const headers: Record<string, unknown> = {};
  const res = {
    setHeader: jest.fn((key: string, value: unknown) => {
      headers[key] = value;
    }),
    getHeader: (key: string) => headers[key],
    status: jest.fn(),
    json: jest.fn(),
    redirect: jest.fn(),
    end: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as NextApiResponse & {
    json: jest.Mock;
    redirect: jest.Mock;
  };
}
function req(overrides: object = {}) {
  return {
    method: "GET",
    cookies: {},
    headers: {},
    query: {},
    ...overrides,
  } as NextApiRequest;
}
function sessionCookie() {
  const res = response();
  writeStaffCookie(res, "session", { accessToken: "private-token" }, 300);
  const cookie = String(res.getHeader("Set-Cookie")).split(";")[0];
  const split = cookie.indexOf("=");
  return { [cookie.slice(0, split)]: cookie.slice(split + 1) };
}
beforeEach(() => {
  Object.assign(process.env, {
    STAFF_SITE_ORIGIN: "https://site.example",
    STAFF_KEYCLOAK_ISSUER: "https://auth.example/realms/TripSit",
    STAFF_KEYCLOAK_CLIENT_ID: "staff",
    STAFF_KEYCLOAK_CLIENT_SECRET: "secret",
    STAFF_COOKIE_SECRET: "ab".repeat(32),
    TRIPBOT_API_URL: "https://bot.example",
  });
  global.fetch = jest.fn();
});
afterEach(() => {
  process.env = { ...environment };
  jest.restoreAllMocks();
});

it("requires complete configuration and secure service URLs", () => {
  delete process.env.STAFF_COOKIE_SECRET;
  expect(staffConfig).toThrow("not configured");
  process.env.STAFF_COOKIE_SECRET = "ab".repeat(32);
  process.env.TRIPBOT_API_URL = "http://bot.example";
  expect(staffConfig).toThrow("HTTPS");
});

it("encrypts session tokens and rejects tampering, expiry, and cross-purpose cookies", () => {
  const cookies = sessionCookie();
  expect(Object.values(cookies)[0]).not.toContain("private-token");
  expect(staffToken(req({ cookies }))).toBe("private-token");
  const name = Object.keys(cookies)[0];
  expect(
    readStaffCookie(
      req({ cookies: { [name]: cookies[name].slice(0, -8) + "AAAAAAAA" } }),
      "session",
    ),
  ).toBeNull();
  expect(
    readStaffCookie(
      req({ cookies: { "__Host-staff_login": cookies[name] } }),
      "login",
    ),
  ).toBeNull();
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 301000);
  expect(() => staffToken(req({ cookies }))).toThrow("Sign in");
});

it("creates state and PKCE and enforces same-origin writes", () => {
  const login = newStaffLogin();
  const url = new URL(login.url);
  expect(url.searchParams.get("state")).toBe(login.state);
  expect(url.searchParams.get("code_challenge")).toBe(
    createHash("sha256").update(login.verifier).digest("base64url"),
  );
  expect(() =>
    assertStaffOrigin(req({ headers: { origin: "https://evil.example" } })),
  ).toThrow("origin");
  expect(() =>
    assertStaffOrigin(req({ headers: { origin: "https://site.example" } })),
  ).not.toThrow();
});

it("does not call TripBot for an unsigned or forged session", async () => {
  const res = response();
  await handler(req({ query: { path: ["appeals"] } }), res);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(fetch).not.toHaveBeenCalled();
});

it("forwards only validated decisions, using the private session token", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  } as Response);
  const res = response();
  await handler(
    req({
      method: "POST",
      cookies: sessionCookie(),
      headers: { origin: "https://site.example" },
      query: { path: ["appeals", "11111111-1111-4111-8111-111111111111"] },
      body: {
        decision: "ACCEPTED",
        responseMessage: " Welcome back ",
        decidedByDiscordId: "forged",
      },
    }),
    res,
  );
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/api/v2/appeals/staff/11111111"),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer private-token",
      }),
      body: JSON.stringify({
        decision: "ACCEPTED",
        responseMessage: "Welcome back",
      }),
    }),
  );
  expect(res.json).toHaveBeenCalledWith({ success: true });
});

it.each([
  {
    headers: { origin: "https://evil.example" },
    body: { decision: "ACCEPTED", responseMessage: "ok" },
    status: 403,
  },
  {
    headers: { origin: "https://site.example" },
    body: { decision: "RECEIVED", responseMessage: "ok" },
    status: 400,
  },
  {
    headers: { origin: "https://site.example" },
    body: { decision: "DENIED", responseMessage: " " },
    status: 400,
  },
])(
  "rejects invalid or cross-origin decisions",
  async ({ headers, body, status }) => {
    const res = response();
    await handler(
      req({
        method: "POST",
        cookies: sessionCookie(),
        headers,
        body,
        query: { path: ["appeals", "11111111-1111-4111-8111-111111111111"] },
      }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(status);
    expect(fetch).not.toHaveBeenCalled();
  },
);

it("fails closed on permission errors and sanitizes backend failures", async () => {
  jest.mocked(fetch).mockResolvedValue({ ok: false, status: 403 } as Response);
  await expect(tripbotRequest("token", "/session")).rejects.toMatchObject({
    status: 403,
  });
  jest.mocked(fetch).mockRejectedValue(new Error("private internal hostname"));
  await expect(tripbotRequest("token", "/session")).rejects.toThrow(
    "TripBot is unavailable",
  );
});

it("rejects OAuth callbacks without the matching state cookie before token exchange", async () => {
  const res = response();
  await authHandler(
    req({ query: { action: "callback", code: "code", state: "forged" } }),
    res,
  );
  expect(res.redirect).toHaveBeenCalledWith(
    303,
    "/dashboard/appeals?signin=expired",
  );
  expect(fetch).not.toHaveBeenCalled();
});

it("validates live staff access before establishing a session", async () => {
  const login = newStaffLogin();
  const start = response();
  writeStaffCookie(
    start,
    "login",
    { state: login.state, verifier: login.verifier },
    600,
  );
  const cookie = String(start.getHeader("Set-Cookie")).split(";")[0];
  const cookies = {
    "__Host-staff_login": cookie.slice(cookie.indexOf("=") + 1),
  };
  jest
    .mocked(fetch)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token", expires_in: 300 }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ canManageAppeals: false }),
    } as Response);
  const res = response();
  await authHandler(
    req({
      cookies,
      query: { action: "callback", state: login.state, code: "code" },
    }),
    res,
  );
  expect(res.redirect).toHaveBeenCalledWith(
    303,
    "/dashboard/appeals?signin=denied",
  );
  expect(String(res.getHeader("Set-Cookie"))).not.toContain("staff_session");
});

it("completes staff OAuth with two scoped HttpOnly cookies and no tokens in the redirect", async () => {
  const login = newStaffLogin();
  const start = response();
  writeStaffCookie(
    start,
    "login",
    { state: login.state, verifier: login.verifier },
    600,
  );
  const cookie = String(start.getHeader("Set-Cookie")).split(";")[0];
  const cookies = {
    "__Host-staff_login": cookie.slice(cookie.indexOf("=") + 1),
  };
  jest
    .mocked(fetch)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "private-token", expires_in: 300 }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ canManageAppeals: true }),
    } as Response);
  const res = response();
  await authHandler(
    req({
      cookies,
      query: { action: "callback", state: login.state, code: "code" },
    }),
    res,
  );
  expect(res.redirect).toHaveBeenCalledWith(303, "/dashboard/appeals");
  const setCookies = res.getHeader("Set-Cookie") as string[];
  expect(setCookies).toHaveLength(2);
  expect(setCookies[0]).toContain("__Host-staff_login=;");
  expect(setCookies[1]).toContain("__Host-staff_session=");
  expect(setCookies[1]).toContain("HttpOnly; SameSite=Lax");
  expect(setCookies[1]).toContain("Secure");
  expect(setCookies[1]).not.toContain("private-token");
  expect(fetch).toHaveBeenNthCalledWith(
    1,
    expect.stringContaining("/token"),
    expect.objectContaining({
      body: expect.any(URLSearchParams),
    }),
  );
  const body = jest.mocked(fetch).mock.calls[0][1]?.body as URLSearchParams;
  expect(body.get("code_verifier")).toBe(login.verifier);
});

it("allows staff logout only from the configured website origin", async () => {
  const rejected = response();
  await authHandler(
    req({
      method: "POST",
      query: { action: "logout" },
      headers: { origin: "https://evil.example" },
    }),
    rejected,
  );
  expect(rejected.status).toHaveBeenCalledWith(403);
  expect(rejected.getHeader("Set-Cookie")).toBeUndefined();
  const res = response();
  await authHandler(
    req({
      method: "POST",
      query: { action: "logout" },
      headers: { origin: "https://site.example" },
    }),
    res,
  );
  expect(res.redirect).toHaveBeenCalledWith(303, "/dashboard/appeals");
  expect(String(res.getHeader("Set-Cookie"))).toContain("Max-Age=0");
});

describe("staff API routes", () => {
  function ok(body: unknown) {
    return { ok: true, json: async () => body } as Response;
  }

  it("returns 404 without a catch-all path", async () => {
    const res = response();
    await handler(req({ query: {} }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("proxies the session check and the queue filter", async () => {
    jest
      .mocked(fetch)
      .mockResolvedValueOnce(ok({ canManageAppeals: true }))
      .mockResolvedValueOnce(ok({ appeals: [], hasMore: false }));
    const session = response();
    await handler(
      req({ cookies: sessionCookie(), query: { path: ["session"] } }),
      session,
    );
    expect(session.json).toHaveBeenCalledWith({ canManageAppeals: true });
    const queue = response();
    await handler(
      req({
        cookies: sessionCookie(),
        query: { path: ["appeals"], status: "DENIED", page: "2" },
      }),
      queue,
    );
    expect(fetch).toHaveBeenLastCalledWith(
      "https://bot.example/api/v2/appeals/staff?status=DENIED&page=2",
      expect.objectContaining({ redirect: "error" }),
    );
    expect(queue.json).toHaveBeenCalledWith({ appeals: [], hasMore: false });
  });

  it("asks for the first page of pending appeals by default", async () => {
    jest.mocked(fetch).mockResolvedValue(ok({ appeals: [], hasMore: false }));
    await handler(
      req({ cookies: sessionCookie(), query: { path: ["appeals"] } }),
      response(),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://bot.example/api/v2/appeals/staff?status=RECEIVED&page=0",
      expect.any(Object),
    );
  });

  it.each([
    { status: "OPEN", page: "0" },
    { status: ["RECEIVED"], page: "0" },
    { status: "RECEIVED", page: "-1" },
    { status: "RECEIVED", page: ["0"] },
  ])("rejects the queue filter %o", async (filter) => {
    const res = response();
    await handler(
      req({
        cookies: sessionCookie(),
        query: { path: ["appeals"], ...filter },
      }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a malformed appeal ID and a missing body", async () => {
    const badId = response();
    await handler(
      req({
        method: "POST",
        cookies: sessionCookie(),
        headers: { origin: "https://site.example" },
        query: { path: ["appeals", "../session"] },
        body: { decision: "DENIED", responseMessage: "No" },
      }),
      badId,
    );
    expect(badId.status).toHaveBeenCalledWith(400);
    const noBody = response();
    await handler(
      req({
        method: "POST",
        cookies: sessionCookie(),
        headers: { origin: "https://site.example" },
        query: { path: ["appeals", "11111111-1111-4111-8111-111111111111"] },
      }),
      noBody,
    );
    expect(noBody.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a response over 2000 characters", async () => {
    const res = response();
    await handler(
      req({
        method: "POST",
        cookies: sessionCookie(),
        headers: { origin: "https://site.example" },
        query: { path: ["appeals", "11111111-1111-4111-8111-111111111111"] },
        body: { decision: "DENIED", responseMessage: "x".repeat(2001) },
      }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it.each([
    { method: "DELETE", path: ["appeals"], allow: "GET" },
    { method: "GET", path: ["appeals", "id"], allow: "POST" },
    { method: "GET", path: ["other"], allow: "GET" },
  ])("answers 405 to $method $path", async ({ method, path, allow }) => {
    const res = response();
    await handler(
      req({ method, cookies: sessionCookie(), query: { path } }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.getHeader("Allow")).toBe(allow);
  });

  it("reports a 503 when staff review is not configured", async () => {
    delete process.env.STAFF_SITE_ORIGIN;
    const res = response();
    await handler(req({ query: { path: ["session"] } }), res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: "Staff review is not configured.",
    });
  });

  it("hides unexpected errors behind a generic message", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token < in private HTML");
      },
    } as unknown as Response);
    const res = response();
    await handler(
      req({ cookies: sessionCookie(), query: { path: ["session"] } }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: "Staff review is temporarily unavailable.",
    });
  });

  it("maps TripBot failures to safe messages", async () => {
    jest
      .mocked(fetch)
      .mockResolvedValue({ ok: false, status: 409 } as Response);
    await expect(tripbotRequest("token", "/x")).rejects.toMatchObject({
      status: 409,
      message:
        "This appeal changed or was already reviewed. Refresh the queue.",
    });
    jest
      .mocked(fetch)
      .mockResolvedValue({ ok: false, status: 500 } as Response);
    await expect(tripbotRequest("token", "/x")).rejects.toMatchObject({
      status: 503,
    });
    jest
      .mocked(fetch)
      .mockResolvedValue({ ok: false, status: 418 } as Response);
    await expect(tripbotRequest("token", "/x")).rejects.toThrow(
      "TripBot could not complete the request.",
    );
  });
});

describe("staff config and cookies", () => {
  it("allows HTTP only for localhost outside production", () => {
    Object.assign(process.env, {
      STAFF_SITE_ORIGIN: "http://localhost:3000",
      TRIPBOT_API_URL: "http://127.0.0.1:1887/",
      STAFF_KEYCLOAK_ISSUER: "https://auth.example/realms/TripSit/",
    });
    const config = staffConfig();
    expect(config.secure).toBe(false);
    expect(config.botUrl).toBe("http://127.0.0.1:1887");
    expect(config.issuer).toBe("https://auth.example/realms/TripSit");
    const res = response();
    writeStaffCookie(res, "session", { accessToken: "t" }, 60);
    expect(String(res.getHeader("Set-Cookie"))).toMatch(/^staff_session=/);
    expect(String(res.getHeader("Set-Cookie"))).not.toContain("Secure");
  });

  it("rejects credentials, queries, and fragments in service URLs", () => {
    for (const bad of [
      "https://user:pass@bot.example",
      "https://bot.example?x=1",
      "https://bot.example#x",
    ]) {
      process.env.TRIPBOT_API_URL = bad;
      expect(staffConfig).toThrow("HTTPS");
    }
  });

  it("rejects a cookie secret that is not 32 bytes of hex", () => {
    process.env.STAFF_COOKIE_SECRET = "not-hex";
    expect(staffConfig).toThrow("not configured");
  });

  it("refuses a session that would not fit in a cookie", () => {
    expect(() =>
      writeStaffCookie(
        response(),
        "session",
        { accessToken: "x".repeat(4000) },
        60,
      ),
    ).toThrow("too large");
  });

  it("ignores a decrypted cookie without an expiry", () => {
    expect(readStaffCookie(req(), "session")).toBeNull();
    const res = response();
    writeStaffCookie(res, "session", {}, -1);
    const cookie = String(res.getHeader("Set-Cookie")).split(";")[0];
    const split = cookie.indexOf("=");
    expect(
      readStaffCookie(
        req({ cookies: { [cookie.slice(0, split)]: cookie.slice(split + 1) } }),
        "session",
      ),
    ).toBeNull();
  });
});

describe("staff sign-in routes", () => {
  function loginCookies() {
    const login = newStaffLogin();
    const start = response();
    writeStaffCookie(
      start,
      "login",
      { state: login.state, verifier: login.verifier },
      600,
    );
    const cookie = String(start.getHeader("Set-Cookie")).split(";")[0];
    return {
      login,
      cookies: { "__Host-staff_login": cookie.slice(cookie.indexOf("=") + 1) },
    };
  }

  it("starts sign-in with an encrypted state cookie", async () => {
    const res = response();
    await authHandler(req({ query: { action: "login" } }), res);
    expect(res.redirect).toHaveBeenCalledWith(
      302,
      expect.stringMatching(
        /^https:\/\/auth\.example\/realms\/TripSit\/protocol\/openid-connect\/auth\?/,
      ),
    );
    expect(String(res.getHeader("Set-Cookie"))).toMatch(
      /^__Host-staff_login=.+; Path=\/; HttpOnly; SameSite=Lax; Max-Age=600; Secure$/,
    );
    expect(res.getHeader("Referrer-Policy")).toBe("no-referrer");
  });

  it.each([
    { method: "GET", action: "logout", status: 405, allow: "POST" },
    { method: "POST", action: "login", status: 405, allow: "GET" },
    { method: "GET", action: "other", status: 404, allow: undefined },
  ])(
    "answers $status to $method $action",
    async ({ method, action, status, allow }) => {
      const res = response();
      await authHandler(req({ method, query: { action } }), res);
      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.getHeader("Allow")).toBe(allow);
    },
  );

  it("reports an unconfigured sign-in as unavailable", async () => {
    delete process.env.STAFF_KEYCLOAK_CLIENT_SECRET;
    const login = response();
    await authHandler(req({ query: { action: "login" } }), login);
    expect(login.status).toHaveBeenCalledWith(503);
    const callback = response();
    await authHandler(req({ query: { action: "callback" } }), callback);
    expect(callback.redirect).toHaveBeenCalledWith(
      303,
      "/dashboard/appeals?signin=unavailable",
    );
  });

  it("treats a Keycloak error or a refused code as an expired sign-in", async () => {
    const { login, cookies } = loginCookies();
    const cancelled = response();
    await authHandler(
      req({
        cookies,
        query: {
          action: "callback",
          state: login.state,
          code: "code",
          error: "access_denied",
        },
      }),
      cancelled,
    );
    expect(cancelled.redirect).toHaveBeenCalledWith(
      303,
      "/dashboard/appeals?signin=expired",
    );
    jest.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);
    const refused = response();
    await authHandler(
      req({
        cookies,
        query: { action: "callback", state: login.state, code: "code" },
      }),
      refused,
    );
    expect(refused.redirect).toHaveBeenCalledWith(
      303,
      "/dashboard/appeals?signin=expired",
    );
  });

  it.each([
    { access_token: 1, expires_in: 300 },
    { access_token: "token", expires_in: 1.5 },
    { access_token: "token", expires_in: 0 },
  ])("rejects the token response %o", async (tokens) => {
    const { login, cookies } = loginCookies();
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => tokens,
    } as Response);
    const res = response();
    await authHandler(
      req({
        cookies,
        query: { action: "callback", state: login.state, code: "code" },
      }),
      res,
    );
    expect(res.redirect).toHaveBeenCalledWith(
      303,
      "/dashboard/appeals?signin=unavailable",
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("caps the session at one hour", async () => {
    const { login, cookies } = loginCookies();
    jest
      .mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "token", expires_in: 86400 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ canManageAppeals: true }),
      } as Response);
    const res = response();
    await authHandler(
      req({
        cookies,
        query: { action: "callback", state: login.state, code: "code" },
      }),
      res,
    );
    expect((res.getHeader("Set-Cookie") as string[])[1]).toContain(
      "Max-Age=3600",
    );
  });

  it("reports an unexpected failure during sign-in as unavailable", async () => {
    const { login, cookies } = loginCookies();
    jest.mocked(fetch).mockRejectedValueOnce(new Error("network"));
    const res = response();
    await authHandler(
      req({
        cookies,
        query: { action: "callback", state: login.state, code: "code" },
      }),
      res,
    );
    expect(res.redirect).toHaveBeenCalledWith(
      303,
      "/dashboard/appeals?signin=unavailable",
    );
  });
});
