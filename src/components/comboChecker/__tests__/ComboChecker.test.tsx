import { fireEvent, render, screen } from "@testing-library/react";
import ComboPage from "@/pages/combo";
import ComboResults from "../ComboResults";
import { getCombo, RANK } from "../comboData";

test("searches, compares, removes and clears selected substances", () => {
  render(<ComboPage />);
  const search = screen.getByRole("textbox", { name: "Search substances" });
  const button = (name: string) => screen.getByRole("button", { name });

  expect(screen.getByText(/select two or more substances/i)).toBeVisible();
  fireEvent.click(button("Alcohol"));
  expect(screen.getByText(/compare with Alcohol/)).toBeVisible();
  fireEvent.change(search, { target: { value: "  kEtAmInE  " } });
  expect(button("Alcohol")).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("button", { name: "Cocaine" })).toBeNull();

  fireEvent.click(button("Ketamine"));
  expect(screen.getByText("Alcohol + Ketamine")).toBeVisible();
  fireEvent.click(button("Alcohol"));
  expect(screen.queryByText("Alcohol + Ketamine")).toBeNull();
  expect(screen.getByText(/compare with Ketamine/)).toBeVisible();
  fireEvent.click(button("Clear (1)"));
  expect(button("Ketamine")).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText(/select two or more substances/i)).toBeVisible();
});

test("renders every pair in selection order or severity order", () => {
  const selected = ["Alcohol", "Cannabis", "Ketamine"];
  const pairs = [
    ["Alcohol", "Cannabis"],
    ["Alcohol", "Ketamine"],
    ["Cannabis", "Ketamine"],
  ];
  const titles = () =>
    screen
      .getAllByText(/^(Alcohol|Cannabis) \+ /)
      .map((node) => node.textContent);
  const { rerender } = render(
    <ComboResults
      selected={selected}
      accent="#2487ce"
      showExplanations={false}
      sortBySeverity={false}
    />,
  );
  expect(titles()).toEqual(pairs.map((pair) => pair.join(" + ")));
  const note = getCombo("Alcohol", "Ketamine").note;
  expect(note).toBeTruthy();
  expect(screen.queryByText(note)).toBeNull();

  rerender(
    <ComboResults
      selected={selected}
      accent="#2487ce"
      showExplanations
      sortBySeverity
    />,
  );
  expect(titles()).toEqual(
    pairs
      .map(([a, b]) => ({
        title: `${a} + ${b}`,
        rank: RANK[getCombo(a, b).risk],
      }))
      .sort((a, b) => b.rank - a.rank)
      .map(({ title }) => title),
  );
  expect(screen.getByText(note)).toBeVisible();
});
