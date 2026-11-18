/** @jest-environment node */
import { getLoginUrl, getPostLogoutUrl } from "../keycloak";

afterEach(() => jest.restoreAllMocks());

test("rejects server-side login initiation and omits the server logout origin", async () => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "appeals",
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: { getItem: () => null },
  });
  try {
    await expect(getLoginUrl()).rejects.toThrow(
      "Login must start in a browser.",
    );
    expect(
      new URL(getPostLogoutUrl()).searchParams.get("post_logout_redirect_uri"),
    ).toBe("");
  } finally {
    Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
