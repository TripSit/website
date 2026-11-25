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

test("separates disabled message moderation and model training from explicit AI features", () => {
  render(<PrivacyPage />);
  const article = within(screen.getByRole("article"));
  expect(article.getByText(/The active message handler/)).toHaveTextContent(
    /does not call the AI moderation function.*does not use Discord message content to train or fine-tune AI or machine-learning models/,
  );
  expect(
    article.getByText(/Translation sends a selected message/),
  ).toHaveTextContent(
    /only if its author has agreed.*do not fetch conversation history or save their prompts and responses as AI message history/,
  );
  expect(
    article.getByText(/When configured, a separate developer-only/),
  ).toHaveTextContent(
    /Anthropic.*GitHub.*separate from TripBot database deletion/,
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
