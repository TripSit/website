import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComboPage, { getStaticProps } from "@/pages/combo";
import ComboChecker from "../ComboChecker";
import ComboResults from "../ComboResults";
import { getCombo, RANK } from "../comboData";

test("links to chart attribution and a current way to report incorrect data", () => {
  render(<ComboPage />);

  expect(
    screen.getByRole("link", { name: "Re-use and attribution information" }),
  ).toHaveAttribute(
    "href",
    "https://wiki.tripsit.me/wiki/Drug_combinations#Use_&_Attribution",
  );
  expect(
    screen.getByRole("link", { name: "Report a problem" }),
  ).toHaveAttribute(
    "href",
    "https://github.com/TripSit/website/issues/new?template=bug_report.md",
  );
});

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

test("announces pair counts and highest risk while keyboard focus stays on the selector", async () => {
  const user = userEvent.setup();
  render(<ComboChecker />);
  const status = screen.getByRole("status");
  expect(status).toHaveAttribute("aria-live", "polite");
  expect(status).toHaveAttribute("aria-atomic", "true");
  expect(status).toHaveTextContent("No combinations to display.");

  for (const name of ["Alcohol", "Opioids", "Cannabis"]) {
    const button = screen.getByRole("button", { name });
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveFocus();
    expect(screen.getByRole("status")).toBe(status);
  }
  expect(status).toHaveTextContent(
    "3 pairs displayed. Highest risk: Dangerous.",
  );
  const cannabis = screen.getByRole("button", { name: "Cannabis" });
  await user.keyboard(" ");
  expect(cannabis).toHaveFocus();
  expect(status).toHaveTextContent(
    "1 pair displayed. Highest risk: Dangerous.",
  );
  expect(status).not.toHaveTextContent("Alcohol + Opioids");

  await user.click(screen.getByRole("button", { name: "Clear (2)" }));
  expect(screen.getByRole("status")).toBe(status);
  expect(status).toHaveTextContent("No combinations to display.");
});

test("announces the highest displayed risk regardless of card order", () => {
  render(
    <ComboResults
      selected={["Cannabis", "LSD", "Alcohol", "Opioids"]}
      accent="#2487ce"
      showExplanations={false}
      sortBySeverity={false}
    />,
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "6 pairs displayed. Highest risk: Dangerous.",
  );
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

test("lists the selected substances' other names from the drug database", async () => {
  const { props } = await getStaticProps();
  expect(props.nicknames.LSD).toEqual(expect.arrayContaining(["acid"]));
  // Classes have no database entry, so no nicknames.
  expect(props.nicknames.Benzodiazepines).toBeUndefined();

  render(<ComboPage nicknames={props.nicknames} />);
  const button = (name: string) => screen.getByRole("button", { name });
  expect(screen.queryByRole("region", { name: "Also known as" })).toBeNull();

  fireEvent.click(button("Benzodiazepines"));
  expect(screen.queryByRole("region", { name: "Also known as" })).toBeNull();

  fireEvent.click(button("LSD"));
  const footnote = screen.getByRole("region", { name: "Also known as" });
  expect(footnote).toHaveTextContent("LSD");
  expect(footnote).toHaveTextContent("acid");
  expect(footnote).not.toHaveTextContent("Benzodiazepines");
});

test("shows no nickname footnote when none are supplied", () => {
  render(<ComboChecker />);
  fireEvent.click(screen.getByRole("button", { name: "LSD" }));
  expect(screen.queryByRole("region", { name: "Also known as" })).toBeNull();
});
