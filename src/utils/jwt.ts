// Reads the claims from a JWT's payload. The signature isn't checked: only use this to read
// values the server will check anyway, such as when a token expires.
//
// JWT segments are base64url (RFC 7515): "-" and "_" where base64 has "+" and "/", and no
// "=" padding. atob accepts only base64 and throws on "-" or "_", which a payload contains
// depending on its bytes (for example the user's name), so convert it first.
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = (token.split(".")[1] ?? "")
    .replaceAll("-", "+")
    .replaceAll("_", "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  // atob returns one character per byte; the claims are UTF-8.
  const utf8 = Array.from(
    binary,
    (char) => `%${(char.codePointAt(0) ?? 0).toString(16).padStart(2, "0")}`,
  ).join("");
  return JSON.parse(decodeURIComponent(utf8));
}
