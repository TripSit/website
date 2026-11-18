import { parseReagentResults } from "../reagents";

it("splits each reagent from its result and drops the trailing full stop", () => {
  const results = parseReagentResults(
    "Marquis: Yellow > Green. | Mecke: Brown. | Mandelin: No colour change.  ",
  );
  expect(results.map(({ reagent, result }) => [reagent, result])).toEqual([
    ["Marquis", "Yellow > Green"],
    ["Mecke", "Brown"],
    ["Mandelin", "No colour change"],
  ]);
  expect(results[0].stages.map((stage) => stage.colours)).toEqual([
    ["yellow"],
    ["green"],
  ]);
  expect(results[2].stages[0].colours).toEqual(["none"]);
});

it("reads results whose reagent has no colon", () => {
  const [simons, unnamed] = parseReagentResults(
    "Simon's No colour change or Purple. | Turns cloudy",
  );
  expect(simons).toMatchObject({
    reagent: "Simon's",
    result: "No colour change or Purple",
  });
  expect(simons.stages[0].colours).toEqual(["none", "purple"]);
  expect(unnamed).toMatchObject({ reagent: "", result: "Turns cloudy" });
  expect(unnamed.stages[0].colours).toEqual([]);
});

it("finds every colour in a stage once, including shades and mixes", () => {
  const [result] = parseReagentResults(
    "Froehde: Greenish Blue > Violet Orange > Red and Green/Red > Pink, black > Clear",
  );
  expect(result.stages.map((stage) => stage.colours)).toEqual([
    ["green", "blue"],
    ["violet", "orange"],
    ["red", "green"],
    ["pink", "black"],
    ["none"],
  ]);
});

it("gives every entry and stage a distinct key", () => {
  const results = parseReagentResults(
    "Marquis: Brown > Brown | Marquis: Brown",
  );
  expect(new Set(results.map((r) => r.key)).size).toBe(2);
  expect(new Set(results[0].stages.map((s) => s.key)).size).toBe(2);
});

it("returns nothing for missing or empty results", () => {
  expect(parseReagentResults()).toEqual([]);
  expect(parseReagentResults("")).toEqual([]);
  expect(parseReagentResults(" | . | ")).toEqual([]);
});
