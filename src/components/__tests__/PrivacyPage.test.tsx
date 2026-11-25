import { render, screen, within } from "@testing-library/react";
import PrivacyPage from "@/pages/tripbot/privacy";

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
  expect(article.getByText("Last updated: 25 November 2026")).toBeVisible();
  expect(
    article.getByRole("link", { name: "Reflect's privacy policy" }),
  ).toHaveAttribute("href", "/reflect/privacy");
  expect(
    article.getByRole("link", { name: "Back to TripBot" }),
  ).toHaveAttribute("href", "/tripbot");
  const footer = within(screen.getByRole("contentinfo"));
  expect(
    footer.getByRole("link", { name: "TripBot privacy policy" }),
  ).toHaveAttribute("href", "/tripbot/privacy");
  expect(
    footer.getByRole("link", { name: "Terms of service" }),
  ).toHaveAttribute("href", "/terms");
});

test("explains six-day ticket retention and lifecycle data", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByRole("heading", { level: 4, name: "Support ticket retention" }),
  ).toBeVisible();
  const retention = screen.getByText(
    (_, element) =>
      element?.tagName === "P" &&
      /Ticket retention timers are set/.test(element.textContent ?? ""),
  );
  expect(retention).toHaveTextContent(/archives.*3 days.*deletion.*6 days/i);
  expect(retention).toHaveTextContent(
    /removes the Discord thread IDs, first message ID, and moderator IDs/,
  );
  expect(retention).toHaveTextContent(/\/privacy delete.*six months/);
  expect(retention).toHaveTextContent(/references needed to retry/);
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
        /database keeps no ban records about you/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(
    /removes the timer TripBot uses to lift it.*stays in place until a moderator lifts it/,
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
        /Removing the IRC Bridge role, including during a successful/.test(
          element.textContent ?? "",
        ),
    ),
  ).toHaveTextContent(/stops future relays, including queued messages/);
});

test("gives an accessible contact and accurate individual deletion commands", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  for (const link of article.getAllByRole("link", {
    name: "privacy@tripsit.me",
  })) {
    expect(link).toHaveAttribute("href", "mailto:privacy@tripsit.me");
  }
  expect(article.getByText("/idose delete")).toBeVisible();
  expect(article.getByText("/remind_me delete")).toBeVisible();
  expect(article.getByText("YesPlease!")).toBeVisible();
  expect(
    article.getByText(/including if you have left Discord or are banned/),
  ).toBeVisible();
});

test("discloses retention and deletion limits without promising complete erasure", () => {
  render(<PrivacyPage />);
  const article = screen.getByRole("article");
  expect(article).toHaveTextContent(/not a complete data export/);
  expect(article).toHaveTextContent(
    /Some Discord cleanup may already have happened/,
  );
  expect(article).toHaveTextContent(/including when the DM cannot be sent/);
  expect(article).toHaveTextContent(/six months without recorded activity/);
  expect(article).toHaveTextContent(/actions older than two years/);
  expect(article).toHaveTextContent(
    /does not erase the remaining database record/,
  );
  expect(article).toHaveTextContent(
    /no automatic 14-day database deletion rule/,
  );
  expect(article).toHaveTextContent(
    /even if the ban was temporary or later repealed/,
  );
  expect(article).toHaveTextContent(/no bot-enforced expiry/);
  expect(article).toHaveTextContent(
    /Historical AI audit posts and replies on Discord.*are not erased/,
  );
});

test("distinguishes transient message processing from stored content and retention", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByRole("heading", {
      name: "How TripBot uses Discord message content",
    }),
  ).toBeVisible();
  expect(
    article.getByText(/recognize and respond to text commands/),
  ).toHaveTextContent(/active message-driven features/);
  expect(article.getByText(/Text-command recognition/)).toHaveTextContent(
    /transiently in memory.*do not by themselves create a database archive.*caches and relay queues/,
  );
  expect(article.getByText(/Features can store content/)).toHaveTextContent(
    /ticket and appeal details.*reminder text.*Activity features.*Operational logs/,
  );
  expect(
    article.getByRole("link", { name: "retention rules and exceptions below" }),
  ).toHaveAttribute("href", "#Retention");
  expect(
    article.getByRole("link", { name: "deletion controls" }),
  ).toHaveAttribute("href", "#Removing_your_information");
});

test("states that no message content goes to an AI provider and that model training is not done", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByText(/does not use Discord message content to train/),
  ).toHaveTextContent(
    /does not send Discord message content to any AI provider.*AI chat, translation, AI review of RPG flair, and AI moderation have all been removed/,
  );
  expect(
    article.getByText(/AI consent timestamps from the period/),
  ).toHaveTextContent(
    /revoke them with \/ai.*not erased by removing the features/,
  );
  expect(article.queryByText(/OpenAI/)).toBeNull();
  expect(article.queryByText(/Anthropic/)).toBeNull();
});

test("limits direct messages and join checks to what the policy describes", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByText(/only because of something you did/),
  ).toHaveTextContent(/does not send promotional direct messages/);
  expect(article.getByText(/Join checks:/).closest("li")).toHaveTextContent(
    /does not use bans or memberships in other servers/,
  );
  expect(article.getByText(/Replies to/).closest("li")).toHaveTextContent(
    /Replies to \/idose are visible only to you.*does not send you a copy by direct message/,
  );
});

test("keeps IRC consent separate from other processing and existing-copy deletion", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByText(/recognize and respond to text commands/),
  ).toHaveTextContent(
    /Removing the IRC Bridge role stops relaying; it does not stop the other message-driven features/,
  );
  expect(
    article.getByText(/Removing the IRC Bridge role, including/),
  ).toHaveTextContent(
    /stops future relays, including queued messages.*does not guarantee removal of messages already sent to IRC.*IRC servers may retain message history/,
  );
  expect(
    article.getByText(/Ticket retention timers are set/),
  ).toHaveTextContent(
    /3 days.*both the support thread and its separate staff discussion thread after 6 days.*does not erase the remaining database record/,
  );
});

test("explains automatic profiles, staff tools, and posts that mention members", () => {
  render(<PrivacyPage />);
  const article = screen.getByRole("article");
  expect(article).toHaveTextContent(
    /creates a profile automatically when you send a message in the TripSit Discord server or in a direct message to TripBot/,
  );
  expect(article).toHaveTextContent(
    /Sending a message in the TripSit server or to TripBot, or using TripBot again, creates a new profile/,
  );
  expect(article).toHaveTextContent(
    /ask TripBot to notify them.*the next time a member posts/,
  );
  expect(article).toHaveTextContent(
    /voice channel joins, moves, and departures to staff-only Discord log channels/,
  );
  expect(article).toHaveTextContent(
    /birthday greeting that mentions you in a server channel/,
  );
  expect(article).toHaveTextContent(/claimed GitHub bounties/);
  expect(article).toHaveTextContent(
    /reject a TripBot pull request from Discord.*display name and comment publicly on GitHub/,
  );
});

test("matches the deletion scope and current-ban rules to TripBot", () => {
  render(<PrivacyPage />);
  const article = screen.getByRole("article");
  expect(article).toHaveTextContent(
    /in their text or embeds, from TripBot's bot log, bot-error, moderation log, and quote log channels/,
  );
  expect(article).toHaveTextContent(
    /does not search the staff audit log channel/,
  );
  expect(article).toHaveTextContent(
    /the moderators' discussion thread about you, saved Best Of copies/,
  );
  expect(article).toHaveTextContent(
    /when TripBot lifts it at the end of a temporary ban, or when TripBot's daily check finds that Discord no longer has the ban/,
  );
  expect(article).toHaveTextContent(
    /checks hourly and runs this cleanup once a day: at the first check after midnight UTC, and at the first check after each restart/,
  );
  expect(article).toHaveTextContent(
    /when a response was due, when the team responded, and when it sent reminders/,
  );
});

test("covers website appeals and the IRC-to-Discord direction of the bridge", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByRole("heading", {
      level: 3,
      name: "Ban appeals on the TripSit website",
    }),
  ).toBeVisible();
  expect(
    article.getByText(/To appeal a ban on the TripSit website/),
  ).toHaveTextContent(
    /TripSit account linked to Discord.*stores your appeal answers.*staff dashboard/,
  );
  expect(
    article.getByText(/Messages sent on IRC in a shared channel/),
  ).toHaveTextContent(
    /IRC users do not need to opt in.*does not delete its Discord copy/,
  );
  expect(
    article.getByText(/In shared channels, TripBot can relay/),
  ).toHaveTextContent(/private channels are never shared automatically/);
});

test("covers deleted-message copies, log posting, and security incidents", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(
    article.getByText(/When a message is deleted on Discord/),
  ).toHaveTextContent(/Best Of copy and any saved quotes of it.*quote log/);
  expect(screen.getByRole("article")).toHaveTextContent(
    /only warnings and errors are posted to TripBot's bot-error Discord channel/,
  );
  expect(screen.getByRole("article")).toHaveTextContent(
    /moderation log, and quote log channels/,
  );
  expect(
    article.getByRole("heading", { level: 3, name: "Security incidents" }),
  ).toBeVisible();
  expect(
    article.getByText(/accessed TripBot's data without authorization/),
  ).toHaveTextContent(/notify Discord and the affected users/);
  expect(screen.getByRole("article")).not.toHaveTextContent(/mindset/);
});
