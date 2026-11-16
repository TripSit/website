import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

const QUERY = "(prefers-reduced-motion: reduce)";
const originalMatchMedia = window.matchMedia;

// A matchMedia whose reduced-motion answer the test controls.
function mockReducedMotion(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query === QUERY && matches;
    },
    media: query,
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  })) as unknown as typeof window.matchMedia;
  return {
    listeners,
    set(value: boolean) {
      matches = value;
      listeners.forEach((listener) => listener());
    },
  };
}

function Probe() {
  return <p>{usePrefersReducedMotion() ? "reduced" : "full"}</p>;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

test("reports no preference by default", () => {
  render(<Probe />);
  expect(screen.getByText("full")).toBeVisible();
});

test("follows the reduced-motion setting as it changes", () => {
  const media = mockReducedMotion(true);
  const { unmount } = render(<Probe />);
  expect(screen.getByText("reduced")).toBeVisible();

  act(() => media.set(false));
  expect(screen.getByText("full")).toBeVisible();

  unmount();
  expect(media.listeners.size).toBe(0);
});

test("assumes reduced motion while rendering on the server", () => {
  expect(renderToString(<Probe />)).toContain("reduced");
});
