/** @jest-environment node */
import { getLoginUrl, getPostLogoutUrl } from "../keycloak";

afterEach(() => jest.restoreAllMocks());

test("omits browser redirect origins when building authentication URLs on the server", () => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "appeals",
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: { getItem: () => null },
  });
  try {
    expect(new URL(getLoginUrl()).searchParams.get("redirect_uri")).toBe("");
    expect(
      new URL(getPostLogoutUrl()).searchParams.get("post_logout_redirect_uri"),
    ).toBe("");
  } finally {
    Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
