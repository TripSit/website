import { render, screen } from "@testing-library/react";
import KofiButton from "../Kofi";

test("links to TripSit's Ko-fi page with nothing loaded from elsewhere", () => {
  const { container } = render(
    <KofiButton color="#0a9396" title="TripSit Ko-Fi" kofiID="J3J5NOJCE" />,
  );
  const link = screen.getByRole("link", { name: "TripSit Ko-Fi" });
  expect(link).toHaveAttribute("href", "https://ko-fi.com/J3J5NOJCE");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(link).toHaveStyle({ backgroundColor: "#0a9396" });
  // The kofi-button package added a Google Fonts <link> and Ko-fi's hot-linked image.
  expect(container.querySelector("link, img, style")).toBeNull();
  expect(
    container.querySelector('svg[data-icon="bi-cup-hot-fill"]'),
  ).toBeTruthy();
});
