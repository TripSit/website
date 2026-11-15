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
  fireEvent.pointerDown(document.body);
  expect(resources).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(resources);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(nav.queryByRole("link", { name: "Factsheets" })).toBeNull();
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
