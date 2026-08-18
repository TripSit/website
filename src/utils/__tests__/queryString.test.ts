import toQueryString from "../queryString";

describe("toQueryString", () => {
  it("returns an empty string for no arguments", () => {
    expect(toQueryString()).toBe("");
  });

  it("returns an empty string for an empty object", () => {
    expect(toQueryString({})).toBe("");
  });

  it("builds a query string from a single param", () => {
    expect(toQueryString({ foo: "bar" })).toBe("?foo=bar");
  });

  it("builds a query string from multiple params, preserving insertion order", () => {
    expect(toQueryString({ a: "1", b: "2" })).toBe("?a=1&b=2");
  });

  it("URL-encodes special characters", () => {
    expect(toQueryString({ q: "a b&c" })).toBe("?q=a+b%26c");
  });
});
