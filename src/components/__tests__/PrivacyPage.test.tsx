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

test("explains TripBot deletion, moderation handling, and IRC opt-in", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /Use \/privacy get.*\/privacy delete/.test(element.textContent ?? ""),
    ),
  ).toHaveTextContent(/moderation actions about you/);
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /When a moderation action about another user/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(/removes your moderator attribution/);
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /temporary Discord ban is awaiting its automatic lift/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(
    /deletes that timer record after Discord confirms the unban/,
  );
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /aggregate totals and a most recent use time per command/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(/hosting logs and backups/);
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /IRC Bridge.*role for their Discord messages to be sent to IRC/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(/Adding the role opts you in/);
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        /Removing the IRC Bridge role or using/.test(element.textContent ?? ""),
    ),
  ).toHaveTextContent(/stops future relays, including queued messages/);
});
