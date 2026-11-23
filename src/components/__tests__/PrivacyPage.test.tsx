import { render, screen, within } from "@testing-library/react";
import PrivacyPage from "@/pages/privacy";

test("hosts the general privacy policy with its source and local footer links", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByRole("heading", { level: 1, name: "Privacy Policy" }),
  ).toBeVisible();
  expect(
    article.getByRole("heading", {
      level: 2,
      name: "Removing your information",
    }),
  ).toBeVisible();
  expect(article.getByText("Last updated: 11 January 2023")).toBeVisible();
  expect(
    article.getByRole("link", { name: "TripSit Wiki privacy policy" }),
  ).toHaveAttribute(
    "href",
    "https://wiki.tripsit.me/index.php?title=Privacy_Policy&oldid=5929",
  );
  const footer = within(screen.getByRole("contentinfo"));
  expect(footer.getByRole("link", { name: "Privacy policy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  expect(
    footer.getByRole("link", { name: "Terms of service" }),
  ).toHaveAttribute("href", "/terms");
});

test("preserves the data removal command and moderation exception", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByText(/You can use the \/privacy command/),
  ).toHaveTextContent(
    /except for moderation actions associated with your discord ID/,
  );
  expect(
    screen.getByText("Issue information is deleted from the DB after 14 days."),
  ).toBeVisible();
});
