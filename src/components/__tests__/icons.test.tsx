import { render } from "@testing-library/react";
import { BiList, BxCheckDouble, BxSolidHeart } from "../icons";

test("draws a decorative 1em icon in the text colour", () => {
  const { container } = render(<BiList className="text-xl" />);
  const svg = container.querySelector("svg");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("focusable", "false");
  expect(svg).toHaveAttribute("data-icon", "bi-list");
  expect(svg).toHaveAttribute("width", "1em");
  expect(svg).toHaveAttribute("fill", "currentColor");
  expect(svg).toHaveClass("text-xl");
});

test("sits on the line where each icon font put it", () => {
  const { container } = render(
    <>
      <BiList />
      <BxCheckDouble />
    </>,
  );
  const [bootstrap, boxicons] = container.querySelectorAll("svg");
  expect(bootstrap).toHaveClass("align-[-0.125em]");
  expect(boxicons).toHaveClass("align-[-0.0625em]");
});

test("lets a caller's own alignment win", () => {
  const { container } = render(<BxSolidHeart className="align-middle" />);
  const svg = container.querySelector("svg");
  expect(svg).toHaveClass("align-middle");
  expect(svg).not.toHaveClass("align-[-0.0625em]");
});
