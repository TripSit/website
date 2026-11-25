import { render, screen, within } from "@testing-library/react";
import TripBotPage from "@/pages/tripbot";

test("introduces TripBot with commands, community support, and source links", () => {
  render(<TripBotPage />);
  const main = within(screen.getByRole("main"));
  expect(
    main.getByRole("heading", { level: 1, name: "TripBot" }),
  ).toBeVisible();
  expect(
    main.getByRole("link", { name: "Join TripSit on Discord" }),
  ).toHaveAttribute("href", "https://discord.gg/tripsit");
  expect(main.getByRole("link", { name: "TripBot on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/TripSit/TripBot",
  );
  expect(main.getByRole("link", { name: "live chat" })).toHaveAttribute(
    "href",
    "/webchat",
  );
  for (const command of ["/help", "/drug", "/combo", "/remind_me"]) {
    expect(main.getAllByText(command).length).toBeGreaterThan(0);
  }
});

test("links directly to the scoped policy and describes data controls without promising erasure", () => {
  render(<TripBotPage />);
  const main = within(screen.getByRole("main"));
  for (const name of [
    "Read the privacy policy",
    "Storage, retention, and deletion details",
  ]) {
    expect(main.getByRole("link", { name })).toHaveAttribute(
      "href",
      "/tripbot/privacy",
    );
  }
  expect(
    main.getByRole("link", { name: "privacy@tripsit.me" }),
  ).toHaveAttribute("href", "mailto:privacy@tripsit.me");
  expect(screen.getByRole("main")).toHaveTextContent(
    /Removing it stops future relays; copies already sent may remain on IRC/,
  );
  expect(screen.getByRole("main")).toHaveTextContent(
    /does not erase ordinary Discord messages/,
  );
  const footer = within(screen.getByRole("contentinfo"));
  expect(footer.getByRole("link", { name: "TripBot" })).toHaveAttribute(
    "href",
    "/tripbot",
  );
  expect(
    footer.getByRole("link", { name: "TripBot privacy policy" }),
  ).toHaveAttribute("href", "/tripbot/privacy");
});
