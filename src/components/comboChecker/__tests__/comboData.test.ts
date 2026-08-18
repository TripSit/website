import {
  accentTone,
  getCombo,
  GROUPS,
  LEGEND_ORDER,
  RANK,
  RISK,
  SUBSTANCES,
} from "../comboData";

describe("getCombo", () => {
  it("looks up a known combination and maps its status to a risk key", () => {
    expect(getCombo("LSD", "Mushrooms")).toEqual({
      risk: "synergy",
      note: "",
    });
  });

  it("is case-insensitive", () => {
    expect(getCombo("lsd", "MUSHROOMS")).toEqual({
      risk: "synergy",
      note: "",
    });
  });

  it("falls back to the reverse pairing when only that direction is present", () => {
    const forward = getCombo("Alcohol", "GHB/GBL");
    const reverse = getCombo("GHB/GBL", "Alcohol");
    expect(forward).toEqual(reverse);
    expect(forward.risk).toBe("dangerous");
    expect(forward.note).not.toBe("");
  });

  it("includes the note when the dataset provides one", () => {
    expect(getCombo("LSD", "Cannabis")).toEqual({
      risk: "caution",
      note: "Cannabis has an unexpectedly strong and somewhat unpredictable synergy with psychedelics.",
    });
  });

  it("returns unknown with a standard disclaimer for unrecognized substances", () => {
    const result = getCombo("Nonexistent Drug A", "Nonexistent Drug B");
    expect(result.risk).toBe("unknown");
    expect(result.note).toMatch(/enough reliable data/i);
  });
});

describe("accentTone", () => {
  it("returns the matching tone for a known accent", () => {
    expect(accentTone("#2487ce")).toEqual({
      container: "#e3f1fb",
      on: "#16507b",
    });
  });

  it("falls back to the default tone for an unknown accent", () => {
    expect(accentTone("#not-a-real-color")).toEqual({
      container: "#e3f1fb",
      on: "#16507b",
    });
  });
});

describe("static data shape", () => {
  it("SUBSTANCES is the flattened list of all group substances", () => {
    expect(SUBSTANCES).toEqual(GROUPS.flatMap((g) => g.substances));
    expect(SUBSTANCES.length).toBeGreaterThan(0);
  });

  it("RISK and RANK define an entry for every LEGEND_ORDER key", () => {
    LEGEND_ORDER.forEach((key) => {
      expect(RISK[key]).toBeDefined();
      expect(typeof RANK[key]).toBe("number");
    });
  });

  it("RANK assigns a strictly higher number to more severe risks", () => {
    expect(RANK.dangerous).toBeGreaterThan(RANK.unsafe);
    expect(RANK.unsafe).toBeGreaterThan(RANK.caution);
    expect(RANK.caution).toBeGreaterThan(RANK.unknown);
    expect(RANK.unknown).toBeGreaterThan(RANK.decrease);
    expect(RANK.decrease).toBeGreaterThan(RANK.nosynergy);
    expect(RANK.nosynergy).toBeGreaterThan(RANK.synergy);
  });
});
