import { fireEvent, render, screen } from "@testing-library/react";
import AccordionSection, { Accordion } from "../AccordionSection";
import Proton from "proton-engine";
import Particles, { frameStep } from "../Particles";
import { items, particleEffects } from "../Particles";

jest.mock(
  "next/dynamic",
  () => () =>
    function Background({ type, color }: { type: string; color?: string }) {
      return (
        <output aria-label="Background effect">
          {type} {color}
        </output>
      );
    },
);

test("provides a default accordion indicator and exposes expansion state", () => {
  const { container } = render(
    <AccordionSection title="Details">Section content</AccordionSection>,
  );
  expect(
    screen.getByRole("button", { name: "Details" }).querySelector("svg"),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-open]")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Details" }));
  expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
});

test("inside an Accordion, opening one section closes the one before it", () => {
  render(
    <Accordion hideSeparator className="w-full px-2">
      <AccordionSection title="First">First body</AccordionSection>
      <AccordionSection title="Second">Second body</AccordionSection>
    </Accordion>,
  );
  const first = screen.getByRole("button", { name: /First/ });
  const second = screen.getByRole("button", { name: /Second/ });
  expect(first).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(first);
  expect(first).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("First body")).toBeVisible();

  fireEvent.click(second);
  expect(first).toHaveAttribute("aria-expanded", "false");
  expect(second).toHaveAttribute("aria-expanded", "true");
  // Closed panels stay in the markup, for search engines, but out of the page.
  expect(screen.getByText("First body")).not.toBeVisible();

  fireEvent.click(second);
  expect(second).toHaveAttribute("aria-expanded", "false");
});

test("passes expanded state to a caller's accordion indicator", () => {
  render(
    <AccordionSection
      title="Details"
      startContent={<span>Icon</span>}
      indicator={({ isOpen }) => (isOpen ? "Expanded" : "Collapsed")}
    >
      Content
    </AccordionSection>,
  );
  expect(screen.getByText("Icon")).toBeVisible();
  expect(screen.getByText("Collapsed")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /Details/ }));
  expect(screen.getByText("Expanded")).toBeVisible();
});

// The picker is a menu: open it, then choose.
const choose = (name: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Animations" }));
  fireEvent.click(screen.getByRole("menuitem", { name }));
};

test("changes the background effect", () => {
  render(<Particles />);
  expect(screen.getByLabelText("Background effect")).toHaveTextContent(
    "cobweb #FFFFFF",
  );
  choose("Tiny Tracers");
  expect(screen.getByLabelText("Background effect")).toHaveTextContent("lines");
  choose("Connections");
  expect(screen.getByLabelText("Background effect")).toHaveTextContent(
    "cobweb #FFFFFF",
  );
});

// Particles ignores a key with no matching effect. Nothing in the menu can produce one,
// so this guards the two lists against drifting apart instead.
test("every item in the picker names a real effect", () => {
  const types = new Set<string>(particleEffects.map((effect) => effect.type));
  expect(items.filter((item) => !types.has(item.key))).toEqual([]);
});

test("shows no background animation or picker to someone who prefers reduced motion", () => {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  try {
    const { container } = render(<Particles />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByLabelText("Background effect")).toBeNull();
  } finally {
    window.matchMedia = original;
  }
});

test("runs the hectic effects at half speed and restores full speed afterwards (#7)", () => {
  const { unmount } = render(<Particles />);
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167);
  choose("Balls");
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167 / 2);
  choose("Tadpoles");
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167);
  choose("Fountain");
  unmount();
  // Leaving the page must not leave the engine slowed for the next visit.
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167);
});

test.each(["color", "ball", "polygon", "square", "fountain"] as const)(
  "slows %s",
  (type) => {
    expect(frameStep(type)).toBeCloseTo(0.0167 / 2);
  },
);

test.each(["lines", "thick", "cobweb", "tadpole", "circle"] as const)(
  "leaves %s at full speed",
  (type) => {
    expect(frameStep(type)).toBeCloseTo(0.0167);
  },
);
