import { act, fireEvent, render, screen, within } from "@testing-library/react";
import Header from "../Header";

test("opens the desktop menu and dismisses it on outside interaction or Escape", () => {
  render(<Header />);
  const nav = within(screen.getByRole("navigation", { name: "Main" }));
  const resources = nav.getByRole("button", { name: "Resources" });
  fireEvent.click(resources);
  fireEvent.pointerDown(resources);
  expect(resources).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(document, { key: "Enter" });
  expect(resources).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(resources);
  expect(resources).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(resources);
  expect(resources).toHaveAttribute("aria-expanded", "true");
  expect(nav.getByRole("link", { name: "Factsheets" })).toHaveAttribute(
    "href",
    "/factsheets",
  );
  expect(nav.getByRole("link", { name: "Reflect App" })).toHaveAttribute(
    "href",
    "/reflect",
  );
  fireEvent.pointerDown(document.body);
  expect(resources).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(resources);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(nav.queryByRole("link", { name: "Factsheets" })).toBeNull();
});

test("keeps a menu open when it's clicked after hovering opened it", () => {
  render(<Header />);
  const nav = within(screen.getByRole("navigation", { name: "Main" }));
  const resources = nav.getByRole("button", { name: "Resources" });

  fireEvent.mouseEnter(resources);
  expect(resources).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(resources);
  expect(resources).toHaveAttribute("aria-expanded", "true");
  // Once clicked, the next click closes it.
  fireEvent.click(resources);
  expect(resources).toHaveAttribute("aria-expanded", "false");

  // Hovering back over a menu that a click opened doesn't change what a click does.
  fireEvent.click(resources);
  fireEvent.mouseEnter(resources);
  fireEvent.click(resources);
  expect(resources).toHaveAttribute("aria-expanded", "false");
});

test("a click while the pointer is leaving keeps the menu open", () => {
  jest.useFakeTimers();
  try {
    render(<Header />);
    const resources = within(
      screen.getByRole("navigation", { name: "Main" }),
    ).getByRole("button", { name: "Resources" });

    fireEvent.mouseEnter(resources);
    fireEvent.mouseLeave(resources);
    fireEvent.click(resources);
    act(() => jest.advanceTimersByTime(300));
    expect(resources).toHaveAttribute("aria-expanded", "true");
  } finally {
    jest.useRealTimers();
  }
});

test("opens the menu on a tablet tap that sends hover and click together", () => {
  render(<Header />);
  const nav = within(screen.getByRole("navigation", { name: "Main" }));
  const resources = nav.getByRole("button", { name: "Resources" });

  act(() => {
    fireEvent.mouseEnter(resources);
    fireEvent.click(resources);
  });
  expect(resources).toHaveAttribute("aria-expanded", "true");
});

test("moving from one hovered menu to another still lets a click keep it open", () => {
  render(<Header />);
  const nav = within(screen.getByRole("navigation", { name: "Main" }));
  const [first, second] = nav
    .getAllByRole("button")
    .filter((button) => button.hasAttribute("aria-expanded"));

  fireEvent.click(first);
  fireEvent.mouseEnter(second);
  expect(second).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "true");
});

test("clears a pending hover timer when navigation is unmounted", () => {
  jest.useFakeTimers();
  try {
    const { unmount } = render(<Header />);
    fireEvent.mouseLeave(screen.getByRole("button", { name: "Resources" }));
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});

test("links to the Reflect app page from both desktop and mobile navigation", () => {
  render(<Header />);
  const main = within(screen.getByRole("navigation", { name: "Main" }));
  expect(main.getByRole("link", { name: "Reflect" })).toHaveAttribute(
    "href",
    "/reflect",
  );
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const mobile = within(screen.getByRole("navigation", { name: "Mobile" }));
  expect(mobile.getByRole("link", { name: "Reflect" })).toHaveAttribute(
    "href",
    "/reflect",
  );
});

test("gives the pointer time to cross from the menu trigger to the panel", () => {
  jest.useFakeTimers();
  try {
    render(<Header />);
    const resources = screen.getByRole("button", { name: "Resources" });
    fireEvent.mouseEnter(resources);
    fireEvent.mouseLeave(resources);
    act(() => jest.advanceTimersByTime(100));
    expect(resources).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseEnter(resources);
    act(() => jest.advanceTimersByTime(250));
    expect(resources).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseLeave(resources);
    act(() => jest.advanceTimersByTime(250));
    expect(resources).toHaveAttribute("aria-expanded", "false");
  } finally {
    jest.useRealTimers();
  }
});

test("reveals mobile navigation and closes it after following a link", () => {
  render(<Header />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const mobile = screen.getByRole("navigation", { name: "Mobile" });
  const factsheets = within(mobile).getByRole("link", { name: "Factsheets" });
  factsheets.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(factsheets);
  expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
});
