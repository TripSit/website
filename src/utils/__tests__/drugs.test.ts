import { DRUGS_STALE_TIME, DRUGS_URL, fetchDrugs } from "../drugs";

test("keeps drug downloads fresh for thirty minutes", () => {
  expect(DRUGS_STALE_TIME).toBe(30 * 60 * 1000);
});

describe("fetchDrugs", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns the drugs from the keyed JSON object as an array", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        lsd: { name: "lsd", pretty_name: "LSD" },
        mdma: { name: "mdma", pretty_name: "MDMA" },
      }),
    });

    await expect(fetchDrugs()).resolves.toEqual([
      { name: "lsd", pretty_name: "LSD" },
      { name: "mdma", pretty_name: "MDMA" },
    ]);
    expect(global.fetch).toHaveBeenCalledWith(DRUGS_URL);
  });

  it("throws when the download fails, so the table shows its error banner", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(fetchDrugs()).rejects.toThrow("HTTP 503");
  });
});
