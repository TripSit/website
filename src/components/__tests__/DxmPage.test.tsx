import { fireEvent, render, screen, within } from "@testing-library/react";
import DxmPage from "@/pages/dxm";
import {
  DXM_PRODUCTS,
  plateauAmounts,
  toKg,
} from "@/components/calculators/dxmData";

function type(label: string, value: string) {
  fireEvent.change(screen.getByRole("textbox", { name: label }), {
    target: { value },
  });
}

function choose(label: string, value: string) {
  fireEvent.change(screen.getByRole("combobox", { name: label }), {
    target: { value },
  });
}

const summary = () =>
  screen.getByRole("status", { name: "What the table shows" });

// [minimum, maximum] for each plateau, as shown in the table.
function table() {
  const rows = screen.getAllByRole("row").slice(1);
  return rows.map((row) =>
    within(row)
      .getAllByRole("cell")
      .map((cell) => cell.textContent),
  );
}

test("works out the amount for each plateau from weight and strength", () => {
  // 70 kg at 10 mg per ml: 70 × 1.5 / 10 = 10.5 ml
  const rows = plateauAmounts(70, 10);
  expect(rows.map((row) => [row.name, row.min, row.max])).toEqual([
    ["1st", 10.5, 17.5],
    ["2nd", 17.5, 52.5],
    ["3rd", 52.5, 105],
    ["4th", 105, 140],
  ]);
  expect(toKg(100, "lbs")).toBeCloseTo(45.36);
  expect(toKg(70, "kg")).toBe(70);
});

test("keeps the products and strengths of the old calculator", () => {
  expect(
    DXM_PRODUCTS.map((product) => [product.name, product.mgPerUnit]),
  ).toEqual([
    ["RoboCough (ml)", 10],
    ["Robitussin DX (oz)", 88.5],
    ["Robitussin DX (ml)", 3],
    ["Robitussin Gelcaps (15 mg caps)", 15],
    ["Pure (mg)", 1],
    ["30mg Gelcaps (30 mg caps)", 30],
    ["RoboTablets (30 mg tablets)", 40.9322],
  ]);
});

test("has the heading, the wiki and safety links, and the disclaimer", () => {
  render(<DxmPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "DXM Dosage Calculator" }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: "DXM" })).toHaveAttribute(
    "href",
    "/factsheets/dxm",
  );
  expect(
    screen.getByRole("link", {
      name: "the plateau model and the effects of each plateau",
    }),
  ).toHaveAttribute("href", "https://wiki.tripsit.me/wiki/DXM#Plateaus");
  expect(screen.getByRole("link", { name: "DXM adulterants" })).toHaveAttribute(
    "href",
    "https://wiki.tripsit.me/wiki/DXM#Adulteration",
  );
  expect(screen.getByRole("link", { name: "combo chart" })).toHaveAttribute(
    "href",
    "/combo",
  );
  expect(screen.getByText(/always start low/)).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Let us know on Discord" }),
  ).toHaveAttribute("href", "https://discord.gg/tripsit");
});

test("asks for a weight before showing doses", () => {
  render(<DxmPage />);
  expect(summary()).toHaveTextContent("Enter your weight to see the doses.");
  expect(table()).toEqual(Array(4).fill(["?", "?"]));
  expect(
    screen.getByText(/have DXM HBr as their only active ingredient/),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: "on Discord" })).toHaveAttribute(
    "href",
    "https://discord.gg/tripsit",
  );
});

test("shows the doses of a listed product, in its own unit", () => {
  render(<DxmPage />);
  expect(screen.getByRole("radio", { name: "Pick from a list" })).toBeChecked();

  type("Your weight", "70");
  expect(summary()).toHaveTextContent(
    "How much RoboCough (ml) to take if you weigh 70 kg.",
  );
  expect(table()).toEqual([
    ["10.5 ml", "17.5 ml"],
    ["17.5 ml", "52.5 ml"],
    ["52.5 ml", "105 ml"],
    ["105 ml", "140 ml"],
  ]);

  // 150 lbs is 68.04 kg; each tablet counts as 40.9322 mg
  type("Your weight", "150");
  choose("Weight unit", "lbs");
  choose("Product", "6");
  expect(summary()).toHaveTextContent(
    "How much RoboTablets (30 mg tablets) to take if you weigh 150 lbs.",
  );
  expect(table()).toEqual([
    ["2.49 tablets", "4.16 tablets"],
    ["4.16 tablets", "12.47 tablets"],
    ["12.47 tablets", "24.93 tablets"],
    ["24.93 tablets", "33.25 tablets"],
  ]);
});

test("reads a comma as a decimal point and keeps small amounts readable", () => {
  render(<DxmPage />);
  // 10,5 kg of Robitussin DX by the ounce: 10.5 × 1.5 / 88.5 = 0.178 oz
  type("Your weight", "10,5");
  choose("Product", "1");
  expect(table()[0]).toEqual(["0.178 oz", "0.297 oz"]);
});

test("works from a strength typed off the label", () => {
  render(<DxmPage />);
  type("Your weight", "70");
  fireEvent.click(screen.getByRole("radio", { name: "Enter its strength" }));

  expect(summary()).toHaveTextContent(
    "Enter your weight and your product's strength to see the doses.",
  );
  expect(screen.getByText(/doesn't contain/)).toBeVisible();
  expect(
    screen.getByRole("link", {
      name: "acetaminophen (paracetamol), guaifenesin, antihistamines or pseudoephedrine",
    }),
  ).toHaveAttribute("href", "https://wiki.tripsit.me/wiki/DXM#Adulteration");

  // 15 mg per 5 ml is 3 mg/ml: 70 × 1.5 / 3 = 35 ml
  type("DXM in your product (mg)", "15");
  choose("Volume of your product (ml)", "5");
  expect(summary()).toHaveTextContent(
    "How many ml of a product with 15 mg of DXM per 5 ml to take if you weigh 70 kg.",
  );
  expect(table()).toEqual([
    ["35 ml", "58.33 ml"],
    ["58.33 ml", "175 ml"],
    ["175 ml", "350 ml"],
    ["350 ml", "466.67 ml"],
  ]);

  // Switching back keeps the weight
  fireEvent.click(screen.getByRole("radio", { name: "Pick from a list" }));
  expect(table()[0]).toEqual(["10.5 ml", "17.5 ml"]);
});

test.each([
  ["zero", "0"],
  ["negative", "-70"],
  ["junk", "abc"],
  ["absurdly large", "1e999"],
])("gives no answer for a %s weight", (_, weight) => {
  render(<DxmPage />);
  type("Your weight", weight);
  expect(table()).toEqual(Array(4).fill(["?", "?"]));
});

test("gives no answer for a zero strength", () => {
  render(<DxmPage />);
  fireEvent.click(screen.getByRole("radio", { name: "Enter its strength" }));
  type("Your weight", "70");
  type("DXM in your product (mg)", "0");
  expect(table()).toEqual(Array(4).fill(["?", "?"]));
});
