import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import AccordionSection from "../AccordionSection";
import Particles from "../Particles";

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
            <div key={item.key} onClick={() => onAction(item.key)}>
              {children(item)}
            </div>
          ))}
          <button onClick={() => onAction("unknown")}>Unknown effect</button>
        </div>
      ),
      Item: ({ children }: { children: ReactNode }) => (
        <button>{children}</button>
      ),
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
