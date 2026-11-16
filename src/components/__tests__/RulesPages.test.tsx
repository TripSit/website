import { render, screen, within } from "@testing-library/react";
import type { GetStaticPropsContext } from "next";
import RulesPage, { getStaticProps as rulesProps } from "@/pages/rules";
import TermsPage, { getStaticProps as termsProps } from "@/pages/terms";

// Both pages build their HTML from src/content at build time.
async function htmlFrom(getStaticProps: typeof rulesProps) {
  const result = await getStaticProps({} as GetStaticPropsContext);
  if (!("props" in result)) {
    throw new Error("getStaticProps returned no props");
  }
  return result.props.html;
}

function footerLink(name: string) {
  return within(screen.getByRole("contentinfo")).getByRole("link", { name });
}

test("hosts the terms of service with linkable sections and the ban appeal form", async () => {
  render(<TermsPage html={await htmlFrom(termsProps)} />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Terms of Service" }),
  ).toBeVisible();
  expect(screen.getByText("Last updated: 16 November 2026")).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Limitations on use" }),
  ).toHaveAttribute("id", "limitations-on-use");
  expect(
    screen.getByRole("heading", { level: 3, name: "Ban appeals" }),
  ).toHaveAttribute("id", "ban-appeals");
  for (const link of screen.getAllByRole("link", { name: "ban appeal form" })) {
    expect(link).toHaveAttribute("href", "/appeal");
  }
  expect(
    screen.getByRole("link", { name: "summary of our rules for Discord" }),
  ).toHaveAttribute("href", "/rules");
  for (const link of screen.getAllByRole("link", {
    name: "appeals@TripSit.me",
  })) {
    expect(link).toHaveAttribute("href", "mailto:appeals@tripsit.me");
  }
  // Not part of a section, so no way back is offered.
  expect(screen.queryByRole("link", { name: /^Back to/ })).toBeNull();
  expect(footerLink("Terms of service")).toHaveAttribute("href", "/terms");
});

test("hosts the Discord rules summary, pointing at the full terms and the appeal form", async () => {
  render(<RulesPage html={await htmlFrom(rulesProps)} />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Rules" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Discord server rules" }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: "full terms of service" }),
  ).toHaveAttribute("href", "/terms");
  expect(screen.getByRole("link", { name: "ban appeal form" })).toHaveAttribute(
    "href",
    "/appeal",
  );
  expect(
    screen.getByRole("link", { name: "other ways to appeal" }),
  ).toHaveAttribute("href", "/terms#ban-appeals");
  expect(footerLink("Rules")).toHaveAttribute("href", "/rules");
});
