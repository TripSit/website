import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import AccordionSection from "../AccordionSection";
import Proton from "proton-engine";
import Particles, { frameStep } from "../Particles";

jest.mock("@heroui/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
    Accordion: {
      Item: ({
        children,
      }: {
        children: (state: { isExpanded: boolean }) => ReactNode;
      }) => {
        const [isExpanded, setExpanded] = React.useState(false);
        return (
          <div>
            <button onClick={() => setExpanded(!isExpanded)}>
              Toggle section
            </button>
            {children({ isExpanded })}
          </div>
        );
      },
      Heading: Wrapper,
      Trigger: ({ children, ...props }: { children: ReactNode }) => (
        <button {...props}>{children}</button>
      ),
      Panel: Wrapper,
      Body: Wrapper,
    },
    Dropdown: Object.assign(Wrapper, {
      Trigger: Wrapper,
      Popover: Wrapper,
      Menu: ({
        items,
        children,
        onAction,
      }: {
        items: { key: string; label: string }[];
        children: (item: { key: string; label: string }) => ReactNode;
        onAction: (key: string) => void;
      }) => (
        <div>
          {items.map((item) => (
            <button
              type="button"
              key={item.key}
              onClick={() => onAction(item.key)}
            >
              {children(item)}
            </button>
          ))}
          <button onClick={() => onAction("unknown")}>Unknown effect</button>
        </div>
      ),
      Item: ({ children }: { children: ReactNode }) => <span>{children}</span>,
    }),
  };
});

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
  fireEvent.click(screen.getByRole("button", { name: "Toggle section" }));
  expect(container.querySelector('[data-open="true"]')).toBeInTheDocument();
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
  fireEvent.click(screen.getByRole("button", { name: "Toggle section" }));
  expect(screen.getByText("Expanded")).toBeVisible();
});

test("changes the background effect and ignores unknown selections", () => {
  render(<Particles />);
  expect(screen.getByLabelText("Background effect")).toHaveTextContent(
    "cobweb #FFFFFF",
  );
  fireEvent.click(screen.getByRole("button", { name: "Tiny Tracers" }));
  expect(screen.getByLabelText("Background effect")).toHaveTextContent("lines");
  fireEvent.click(screen.getByRole("button", { name: "Unknown effect" }));
  expect(screen.getByLabelText("Background effect")).toHaveTextContent("lines");
  fireEvent.click(screen.getByRole("button", { name: "Connections" }));
  expect(screen.getByLabelText("Background effect")).toHaveTextContent(
    "cobweb #FFFFFF",
  );
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
  fireEvent.click(screen.getByRole("button", { name: "Balls" }));
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167 / 2);
  fireEvent.click(screen.getByRole("button", { name: "Tadpoles" }));
  expect(Proton.DEFAULT_INTERVAL).toBeCloseTo(0.0167);
  fireEvent.click(screen.getByRole("button", { name: "Fountain" }));
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
