import { fireEvent, render, screen } from "@testing-library/react";
import MenuButton from "../MenuButton";

const items = [
  { key: "a", label: "Alpha" },
  { key: "b", label: "Beta" },
  { key: "c", label: "Gamma" },
];

const renderMenu = (onAction = jest.fn()) => {
  render(
    <MenuButton
      label="Animations"
      aria-label="Background animation"
      items={items}
      onAction={onAction}
    />,
  );
  return {
    onAction,
    button: screen.getByRole("button", { name: "Animations" }),
  };
};

const openMenu = () => {
  const { onAction, button } = renderMenu();
  fireEvent.click(button);
  return { onAction, button };
};

beforeAll(() => {
  // jsdom has no rAF in some setups, and the menu focuses its first item through one.
  if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
      setTimeout(
        () => cb(0),
        0,
      ) as unknown as number) as typeof requestAnimationFrame;
  }
});

test("stays closed until asked, and says so", () => {
  const { button } = renderMenu();
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(button).toHaveAttribute("aria-haspopup", "menu");
  expect(screen.queryByRole("menu")).toBeNull();
});

test("opens on click and lists every choice", () => {
  const { button } = openMenu();
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("menu")).toHaveAccessibleName("Background animation");
  expect(screen.getAllByRole("menuitem").map((i) => i.textContent)).toEqual([
    "Alpha",
    "Beta",
    "Gamma",
  ]);
});

test("reports the chosen item and closes", () => {
  const { onAction, button } = openMenu();
  fireEvent.click(screen.getByRole("menuitem", { name: "Beta" }));
  expect(onAction).toHaveBeenCalledWith("b");
  expect(screen.queryByRole("menu")).toBeNull();
  expect(button).toHaveFocus();
});

test("a second click closes it again", () => {
  const { button } = openMenu();
  fireEvent.click(button);
  expect(screen.queryByRole("menu")).toBeNull();
});

test("closes when something else is clicked", () => {
  openMenu();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole("menu")).toBeNull();
});

test("closes on touch elsewhere", () => {
  openMenu();
  fireEvent.touchStart(document.body);
  expect(screen.queryByRole("menu")).toBeNull();
});

test("a click inside leaves it open", () => {
  openMenu();
  fireEvent.mouseDown(screen.getByRole("menu"));
  expect(screen.getByRole("menu")).toBeInTheDocument();
});

test.each([
  ["ArrowDown", "Alpha"],
  ["Enter", "Alpha"],
  [" ", "Alpha"],
  ["ArrowUp", "Gamma"],
])("%s opens the menu on %s", (key, expected) => {
  const { button } = renderMenu();
  fireEvent.keyDown(button, { key });
  expect(screen.getByRole("menu")).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: expected })).toBeInTheDocument();
});

test("another key on the button does nothing", () => {
  const { button } = renderMenu();
  fireEvent.keyDown(button, { key: "x" });
  expect(screen.queryByRole("menu")).toBeNull();
});

test("the arrows move between items and wrap around", () => {
  openMenu();
  const [alpha, beta, gamma] = screen.getAllByRole("menuitem");
  alpha.focus();
  fireEvent.keyDown(alpha, { key: "ArrowDown" });
  expect(beta).toHaveFocus();
  fireEvent.keyDown(beta, { key: "ArrowUp" });
  expect(alpha).toHaveFocus();
  fireEvent.keyDown(alpha, { key: "ArrowUp" });
  expect(gamma).toHaveFocus();
  fireEvent.keyDown(gamma, { key: "ArrowDown" });
  expect(alpha).toHaveFocus();
});

test("Home and End jump to the ends", () => {
  openMenu();
  const [alpha, beta, gamma] = screen.getAllByRole("menuitem");
  beta.focus();
  fireEvent.keyDown(beta, { key: "End" });
  expect(gamma).toHaveFocus();
  fireEvent.keyDown(gamma, { key: "Home" });
  expect(alpha).toHaveFocus();
});

test("Escape closes it and gives the button back its focus", () => {
  const { button } = openMenu();
  const [alpha] = screen.getAllByRole("menuitem");
  fireEvent.keyDown(alpha, { key: "Escape" });
  expect(screen.queryByRole("menu")).toBeNull();
  expect(button).toHaveFocus();
});

test("Tab closes it and lets focus move on", () => {
  const { button } = openMenu();
  const [alpha] = screen.getAllByRole("menuitem");
  fireEvent.keyDown(alpha, { key: "Tab" });
  expect(screen.queryByRole("menu")).toBeNull();
  expect(button).not.toHaveFocus();
});

test("an unhandled key inside the menu leaves it alone", () => {
  openMenu();
  const [alpha] = screen.getAllByRole("menuitem");
  alpha.focus();
  fireEvent.keyDown(alpha, { key: "x" });
  expect(screen.getByRole("menu")).toBeInTheDocument();
  expect(alpha).toHaveFocus();
});
