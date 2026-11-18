import { render, screen } from "@testing-library/react";
import ReagentResults from "../ReagentResults";

it("lists each reagent with its result and a swatch per colour", () => {
  const { container } = render(
    <ReagentResults text="Marquis: Yellow > Green. | Ehrlich: No colour change." />,
  );
  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent("Marquis: Yellow > Green");
  expect(items[1]).toHaveTextContent("Ehrlich: No colour change");
  const swatches = [...container.querySelectorAll("[data-colour]")].map(
    (swatch) => swatch.getAttribute("data-colour"),
  );
  expect(swatches).toEqual(["yellow", "green", "none"]);
  expect(container.querySelector('[data-colour="yellow"]')).toHaveStyle({
    backgroundColor: "#f4d03f",
  });
});

it("hides the swatches and arrows from screen readers", () => {
  const { container } = render(
    <ReagentResults text="Mecke: Orange > Purple" />,
  );
  const decoration = container.querySelector('[aria-hidden="true"]');
  expect(decoration).toHaveTextContent("→");
  expect(decoration?.querySelectorAll("[data-colour]")).toHaveLength(2);
});

it("shows a result without a reagent name as plain text", () => {
  render(<ReagentResults text="Turns cloudy" />);
  expect(screen.getByRole("listitem")).toHaveTextContent(/^Turns cloudy$/);
  expect(screen.queryByText(/:/)).toBeNull();
});

it("renders nothing without results", () => {
  const { container } = render(<ReagentResults />);
  expect(container).toBeEmptyDOMElement();
});
