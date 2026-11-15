import { getCombo } from "../comboData";

jest.mock("tripsit_drug_db/combos.json", () => ({
  example: {
    other: { status: "Unrecognized status" },
  },
}));

test("uses unknown risk and an empty note for an unrecognized database status", () => {
  expect(getCombo("example", "other")).toEqual({ risk: "unknown", note: "" });
  expect(getCombo("other", "example")).toEqual({ risk: "unknown", note: "" });
});
