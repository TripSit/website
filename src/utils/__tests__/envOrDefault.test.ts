import { envOrDefault } from "../envOrDefault";

describe("envOrDefault", () => {
  it("uses the value when it is set", () => {
    expect(envOrDefault("example.test", "tripsit.me")).toBe("example.test");
  });

  it.each([undefined, ""])("falls back when the value is %p", (value) => {
    expect(envOrDefault(value, "tripsit.me")).toBe("tripsit.me");
  });
});
