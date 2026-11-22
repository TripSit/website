import {
  accentTone,
  getCombo,
  getComboSources,
  GROUPS,
  LEGEND_ORDER,
  RANK,
  RISK,
  shownSources,
  SUBSTANCES,
  substanceNicknames,
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

  it("returns the same result in either order", () => {
    const forward = getCombo("Alcohol", "GHB/GBL");
    const reverse = getCombo("GHB/GBL", "Alcohol");
    expect(forward).toEqual(reverse);
    expect(forward.risk).toBe("dangerous");
    expect(forward.note).not.toBe("");
  });

  it.each([
    ["DXM", "MXE"],
    ["MXE", "DXM"],
  ])("rates %s + %s as Unsafe", (first, second) => {
    const result = getCombo(first, second);
    expect(result.risk).toBe("unsafe");
    expect(result.note).toMatch(/serotonin syndrome/i);
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

describe("substanceNicknames", () => {
  it("lists each chart substance's other names from the drug database", () => {
    expect(
      substanceNicknames({
        lsd: { aliases: ["LSD", "lsd-25", "acid", "Acid", "lucy"] },
        dextromethorphan: { aliases: ["dxm", "robo"] },
        cannabis: { aliases: [] },
        mushrooms: {},
        unrelated: { aliases: ["not in the chart"] },
      }),
    ).toEqual({
      // The chart's own name and repeats differing only in case are left out.
      LSD: ["lsd-25", "acid", "lucy"],
      // "DXM" is stored under its full name, which counts as another name.
      DXM: ["robo"],
    });
  });
});

describe("getComboSources", () => {
  it("returns the drug team's sources in either order, and none when there are none", () => {
    const sources = getComboSources("MDMA", "SSRIs");
    expect(sources).toHaveLength(3);
    expect(getComboSources("SSRIs", "MDMA")).toEqual(sources);
    expect(getComboSources("LSD", "Mushrooms")).toEqual([]);
    expect(getComboSources("Nothing", "Else")).toEqual([]);
  });
});

describe("shownSources", () => {
  it("tidies the text, links only web addresses and drops sources with nothing to show", () => {
    expect(
      shownSources([
        {
          author: "Malcolm, B.,  & Thomas, K. ",
          title: "A  title",
          url: "https://doi.org/x",
        },
        { title: "No link", url: "javascript:alert(1)" },
        { url: " http://example.test/page " },
        { author: "Only an author" },
        {},
      ]),
    ).toEqual([
      {
        title: "A title",
        author: "Malcolm, B., & Thomas, K.",
        url: "https://doi.org/x",
      },
      { title: "No link", author: "", url: null },
      {
        title: "http://example.test/page",
        author: "",
        url: "http://example.test/page",
      },
    ]);
  });
});
