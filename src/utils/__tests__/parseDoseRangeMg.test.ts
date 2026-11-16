import { parseDoseRangeMg } from "../parseDoseRangeMg";

test("inherits an omitted upper unit from the lower endpoint", () => {
  expect(parseDoseRangeMg("1 mg - 2")).toEqual([1, 2]);
});

test("rejects a range whose upper endpoint overflows during conversion", () => {
  expect(parseDoseRangeMg(`1-${"9".repeat(308)} g`)).toBeUndefined();
});

describe("parseDoseRangeMg", () => {
  it.each([
    ["800-1500ug", [0.8, 1.5]],
    ["1.5-3mg", [1.5, 3]],
    ["325mg-650mg", [325, 650]],
    ["800 µg – 1.5 mg", [0.8, 1.5]],
  ])("normalizes %s to milligrams", (source, expected) => {
    expect(parseDoseRangeMg(source)).toEqual(expected);
  });

  it.each([
    "25-50ug/hr",
    "25ug/hr-50ug/hr",
    "3mg+",
    "3mg",
    "1-3",
    "3mg-1mg",
    "1-3mg/kg",
  ])("leaves %s in the text table only", (source) =>
    expect(parseDoseRangeMg(source)).toBeUndefined(),
  );
});
