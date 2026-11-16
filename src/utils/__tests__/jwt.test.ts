import { decodeJwtPayload } from "../jwt";

// Encodes claims the way Keycloak does: UTF-8 JSON in unpadded base64url.
function tokenWith(claims: object): string {
  const bytes = encodeURIComponent(JSON.stringify(claims)).replace(
    /%([0-9A-F]{2})/g,
    (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)),
  );
  const payload = btoa(bytes)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `header.${payload}.signature`;
}

describe("decodeJwtPayload", () => {
  it("reads a payload that contains base64url's - and _ characters", () => {
    // "?>?" encodes to "Pz4_" and "~~~" to "fn5-", so this payload needs both.
    const token = tokenWith({ exp: 1700000000, a: "?>?", b: "~~~" });
    expect(token).toMatch(/-/);
    expect(token).toMatch(/_/);
    // atob alone rejects it, which logged users out.
    expect(() => atob(token.split(".")[1])).toThrow();

    expect(decodeJwtPayload(token)).toEqual({
      exp: 1700000000,
      a: "?>?",
      b: "~~~",
    });
  });

  it.each(["Zoë", "José", "Jürgen", "Ana 🌸"])(
    "decodes the claims as UTF-8, so a name like %s survives",
    (name) => {
      expect(decodeJwtPayload(tokenWith({ exp: 1, name }))).toEqual({
        exp: 1,
        name,
      });
    },
  );

  it.each([1, 2, 3])(
    "handles every amount of missing padding (%i characters of claims)",
    (length) => {
      const claims = { exp: 1, n: "x".repeat(length) };
      expect(decodeJwtPayload(tokenWith(claims))).toEqual(claims);
    },
  );

  it("throws on a token without a payload", () => {
    expect(() => decodeJwtPayload("not-a-token")).toThrow();
  });
});
