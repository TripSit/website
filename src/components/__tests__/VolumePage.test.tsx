import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VolumePage from "@/pages/volume";
import {
  divideAmounts,
  formatAmount,
  parseAmount,
} from "@/components/calculators/amounts";

function type(label: string, value: string) {
  fireEvent.change(screen.getByRole("textbox", { name: label }), {
    target: { value },
  });
}

const result = (label: string) => screen.getByRole("status", { name: label });

function mockClipboard(writeText: jest.Mock) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

test("reads commas as decimal points and rejects negative or junk input", () => {
  expect(parseAmount(" 2,5 ")).toBe(2.5);
  expect(parseAmount("10")).toBe(10);
  expect(parseAmount("")).toBeNaN();
  expect(parseAmount("-3")).toBeNaN();
  expect(parseAmount("abc")).toBeNaN();
});

test("only answers when the division makes sense", () => {
  expect(divideAmounts("10", "4")).toBe(2.5);
  expect(divideAmounts("10", "0")).toBeUndefined();
  expect(divideAmounts("0", "5")).toBeUndefined();
  expect(divideAmounts("", "5")).toBeUndefined();
});

test("rounds to two decimals, but keeps three significant figures below 1", () => {
  expect(formatAmount(100 / 3)).toBe("33.33");
  expect(formatAmount(1000)).toBe("1000");
  expect(formatAmount(1 / 3)).toBe("0.333");
  expect(formatAmount(0.0125)).toBe("0.0125");
});

test("has the page heading, the wiki guide and all three calculators", () => {
  render(<VolumePage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Volumetric Dosing" }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: "quick guide to volumetric dosing" }),
  ).toHaveAttribute(
    "href",
    "https://wiki.tripsit.me/wiki/Quick_Guide_to_Volumetric_Dosing",
  );
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  expect(
    screen.getByRole("link", { name: "Let us know on Discord" }),
  ).toHaveAttribute("href", "https://discord.gg/tripsit");
});

test("works out solvent, concentration and dose volume", () => {
  render(<VolumePage />);

  // 1 mg/ml from 25 mg needs 25 ml of water
  type("Concentration you want (mg/ml)", "1");
  type("Substance you have (mg)", "25");
  expect(result("Solvent needed (ml)")).toHaveTextContent("25");

  // 100 mg in 30 ml is 3.33 mg/ml
  type("Substance dissolved (mg)", "100");
  type("Solvent used (ml)", "30");
  expect(result("Concentration (mg/ml)")).toHaveTextContent("3.33");

  // A 0.8 mg dose from a 2 mg/ml solution is 0.4 ml
  type("Concentration of your solution (mg/ml)", "2");
  type("Dose you want (mg)", "0,8");
  expect(result("Volume to take (ml)")).toHaveTextContent("0.4");
});

test("shows a placeholder and disables copying until there is an answer", () => {
  render(<VolumePage />);
  expect(result("Solvent needed (ml)")).toHaveTextContent("?");
  const [copyFirst] = screen.getAllByRole("button", { name: "Copy as text" });
  expect(copyFirst).toBeDisabled();
});

test("copies the finished sentence and resets the notice on the next edit", async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  mockClipboard(writeText);
  render(<VolumePage />);

  type("Concentration of your solution (mg/ml)", "2");
  type("Dose you want (mg)", "0.8");
  const copyTake = screen.getAllByRole("button", { name: "Copy as text" })[2];
  fireEvent.click(copyTake);

  await waitFor(() => expect(screen.getByText("Copied")).toBeVisible());
  expect(writeText).toHaveBeenCalledWith(
    "If you have a solution of 2 mg/ml, and want to take 0.8 mg, you need to take 0.4 ml.",
  );

  type("Dose you want (mg)", "1");
  expect(screen.queryByText("Copied")).not.toBeInTheDocument();
});

test("says so when the browser refuses to copy", async () => {
  mockClipboard(jest.fn().mockRejectedValue(new Error("denied")));
  render(<VolumePage />);

  type("Substance dissolved (mg)", "100");
  type("Solvent used (ml)", "50");
  fireEvent.click(screen.getAllByRole("button", { name: "Copy as text" })[1]);

  await waitFor(() =>
    expect(
      screen.getByText("Couldn't copy. Select the text instead."),
    ).toBeVisible(),
  );
});
