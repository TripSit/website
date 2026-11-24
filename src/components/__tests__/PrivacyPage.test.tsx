import { render, screen, within } from "@testing-library/react";
import PrivacyPage from "@/pages/privacy";

test("hosts the current privacy policy with its local footer links", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByRole("heading", { level: 1, name: "Privacy Policy" }),
  ).toBeVisible();
  expect(
    article.getByRole("heading", {
      level: 3,
      name: "Viewing and deleting your information",
    }),
  ).toBeVisible();
  expect(article.getByText("Last updated: 24 November 2026")).toBeVisible();
  expect(
    article.getByRole("link", { name: "Reflect's privacy policy" }),
  ).toHaveAttribute("href", "/reflect/privacy");
  const footer = within(screen.getByRole("contentinfo"));
  expect(footer.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  expect(
    footer.getByRole("link", { name: "Terms of service" }),
  ).toHaveAttribute("href", "/terms");
});

test("explains TripBot data deletion, moderation retention, and IRC opt-in", () => {
  render(<PrivacyPage />);
  expect(screen.getByText(/Use \/privacy get/)).toBeVisible();
  expect(screen.getByText(/\/privacy delete/)).toHaveTextContent(
    /tickets and appeals/,
  );
  expect(
    screen.getByText(/Moderation actions and the Discord ID used to enforce them/),
  ).toHaveTextContent(/retained for up to two years/);
  expect(
    screen.getByText(/IRC Bridge.*role for their Discord messages to be sent to IRC/),
  ).toHaveTextContent(/Adding the role opts you in/);
  expect(
    screen.getByText(/command usage records themselves do not currently have an automatic deletion period/),
  ).toBeVisible();
});
