import randomString from "../randomString";

describe("randomString", () => {
  it("returns a string between 20 and 29 characters long", () => {
    const result = randomString();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThanOrEqual(20);
    expect(result.length).toBeLessThanOrEqual(29);
  });

  it("only contains printable ASCII characters (code points 33-126)", () => {
    const result = randomString();
    Array.from(result).forEach((char) => {
      const code = char.charCodeAt(0);
      expect(code).toBeGreaterThanOrEqual(33);
      expect(code).toBeLessThanOrEqual(126);
    });
  });

  it("returns a different value on each call", () => {
    const first = randomString();
    const second = randomString();
    expect(first).not.toEqual(second);
  });
});
