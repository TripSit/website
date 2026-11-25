# TripBot privacy policy source audit

Rechecked 25 November 2026 against the sibling `/home/erich/projects/tripbot`
working tree. Website baseline: `2fe25b700114a9277b56c1a88c9ad959ea05d54e`
(PR #476); website edits are in `codex/verified-privacy`.

## Scope and evidence limits

TripBot HEAD remains `e5e0236f` on `fix/ack-dm-failure-reason`, with uncommitted
message-handler, privacy, AI, ticket, bridge, schema, and migration changes.
The findings below include those changes. They establish source behavior, not
which code, migrations, Discord permissions, or hosting settings are deployed.
No bot behavior or CI/CD is changed by this website task.

## Current message-content use

- `src/discord/events/messageCreate.ts` calls `messageCommand`, the bridge,
  counting, `youAre`, karma replies, image-only rules, helper activity, watch
  notifications, experience, and announcements, subject to their individual
  channel/member checks. The `thoughtPolice(message)` call is commented out.
- `src/discord/utils/messageCommand.ts` examines message text for legacy text
  commands, mentions, hearts, emoji/sticker commands, and developer requests.
  Content checks do not themselves archive every message body in the database.
  `youAre.ts` can repeat a fragment in a Discord reply. Processing in memory,
  Discord client caches, relay queues, and replies must not be described as
  immediate or guaranteed deletion of all copies.
- Feature data is distinct from transient processing: counters/activity records,
  saved quotes/Best Of, reminders/doses, appeals/moderation, and Discord support
  conversations have their own storage and deletion paths. Aggregate command
  statistics are not a claim that operational logs contain no personal data.
- `src/discord/utils/chatBridge.ts` requires the IRC Bridge role before relaying
  a Discord message. `src/irc/bridge.ts` checks `canSend` for queued lines.
  Removing the role stops future relays but cannot recall already delivered
  lines. Edits add lines; redaction depends on temporary in-memory mappings and
  network support. IRC retention and independently held copies remain separate.
- No model-training/fine-tuning use appears in these message paths. The policy
  states that **TripBot** does not train/fine-tune on Discord message content;
  it does not extend that statement to an unverified provider guarantee.

## Explicit AI features and historical data

- AI chat has been removed, rather than merely rollout-disabled. The current
  `src/global/utils/aiConsent.ts` keeps consent lookup for translation.
- `src/discord/commands/global/m.translate.ts` requires the selected message's
  author to have accepted both AI policies before sending that message to OpenAI.
  `src/global/commands/g.ai.ts` and the RPG flair caller send the selected text
  with system instructions, without fetching conversation history or saving AI
  prompt/response history; OpenAI completion requests set `store: false`.
  RPG feature state and Discord replies are separate from AI message history.
- `src/discord/utils/codeAgentRequest.ts` and
  `src/global/commands/g.codeAgent.ts` can send an explicit, authorized developer
  fix/investigation request to Anthropic's coding agent and open a GitHub PR.
  This is not passive AI moderation of ordinary messages. Provider/GitHub copies
  are not removed by the profile-deletion command.
- Migration `20261124150000_remove_ai_chat_history` drops AI message/image,
  persona/channel tables and legacy user history fields, retaining consent.
  Its existence is not evidence that it ran in production or erased provider,
  Discord audit-channel, reply, log, or backup copies. The policy makes no claim
  that every historical AI copy has already been erased.

## Retention and deletion verified in source

- `src/global/commands/g.privacy.ts`: the eligible Discord-linked profile purge
  runs after six calendar months without recorded activity, excluding unrepealed
  full bans and legacy scrub-marker profiles. Production timer runs daily;
  per-account failures are logged. This is an attempt, not an exact deletion SLA.
- The same module prunes eligible moderation actions older than two years.
  FULL_BAN and BAN_EVASION records (including temporary/repealed full bans),
  and actions about currently banned users are excluded from age-based pruning.
- `src/global/utils/timer.ts`: due reminders are deleted after delivery attempts,
  even if the DM fails. Delivered DMs are not erased by database deletion.
- `src/global/utils/tickets.ts`, ticket callers, and migration
  `20261124160000_ticket_retention_six_days`: production deadlines are archive
  after three days and deletion after six, set/refreshed by ticket lifecycle
  operations. Archive does not extend an existing deletion deadline.
- Current scheduled ticket cleanup attempts to delete **both** support/meta
  threads, retries failures, clears stored Discord references and closer/reopener
  attribution, and marks the DB record DELETED. It does not delete the DB row.
  This supersedes the 24 November finding that scheduled cleanup left the meta
  thread untouched. The old policy's 14-day DB deletion promise remains unsupported.
- `src/discord/commands/global/d.privacy.ts`: get is a field/count summary, not
  a full export. Delete requires `YesPlease!`. Replies default to ephemeral but
  can be made public. Success/failure is reported; earlier Discord cleanup may
  already have happened when deletion fails.
- `src/global/commands/g.privacy.ts` and
  `src/discord/utils/privacyDeletion.ts`: Discord cleanup precedes the database
  transaction, removes linked threads/Best Of copies and IRC Bridge role, and
  deletes log messages whose text contains the literal Discord ID. This does
  not match every identifying reference in embeds, attachments, or usernames.
- Successful deletion removes profile/dependent feature records, including AI
  consent, tickets, appeals, doses, reminders, quotes, and moderation history.
  Other users' moderation records lose moderator attribution/notes; temporary
  ban timers persist until confirmed unban. Ordinary Discord messages, IRC
  copies, provider copies, hosting logs/backups and anonymous aggregate stats
  are not erased by this command. Using the bot again can create new data.
- Individual commands are `/idose delete` and `/remind_me delete`, using record
  numbers from their get commands; the old remove-command names are incorrect.

## Remaining operational mismatches and unknowns

- Confirm deployment of the matching bot revision/migrations and live Discord
  cleanup permissions before treating source findings as production evidence.
- Logs, backups, and IRC server history have no verified fixed retention period
  in this audit. No expiry or restore-time deletion guarantee is invented.
- Verify mailbox delivery for the user-selected `privacy@tripsit.me` contact.
- Historical AI Discord/provider cleanup remains unconfirmed. The dropped-table
  migration does not prove complete historical erasure.
- Retention commitments remain six months for eligible inactive profiles and
  two years for eligible moderation actions, with their existing exclusions.
  No new automatic expiry is promised for active users' feature records.
- The 24 November bot test run passed 215 tests and failed four expired-ban tests
  whose fixtures omitted `user_id`. Those results are historical, not a check of
  the changed 25 November bot working tree. This update runs website checks only.

## Live recheck after promotion (25 November 2026)

TripBot `main` and `uat` were both `6fb25ce9` (PR #1569) when rechecked, so the
source findings above now describe production. That recheck found these policy
gaps, now covered at `/tripbot/privacy`:

- Profiles are created automatically for anyone who posts in the TripSit server
  or DMs the bot (`messageCreate` calls `getOrCreateUser`), and for TripSit-server
  slash commands; deletion is undone by the next message, not only by bot use.
- `users.last_seen_in` is no longer written and `users.joined_at` is the profile
  creation time; the policy no longer implies channel tracking or guild-join time.
- Undisclosed processing: moderators' watch requests (`g.watchuser.ts`), staff
  audit-log posts for role changes and voice moves (`guildMemberUpdate.ts`,
  `voiceStateUpdate.ts`), birthday and course-completion posts (`timer.ts`),
  helper activity, GitHub bounty claims, and public GitHub comments from PR
  rejections (`g.prReview.ts`).
- `/privacy delete` also searches the bot log channel and embeds, deletes the
  per-user moderator thread, and does not search `CHANNEL_AUDITLOG`.
- Retained ticket rows also keep `response_due_at`, `responded_at`,
  `team_reminded_at` and `user_reminded_at`.
- Website appeals (Keycloak sign-in mapped to a Discord ID, stored by the bot API,
  posted to the moderator thread, reviewed on `/dashboard/appeals`) had no policy.
- IRC users' messages reach Discord without opt-in, IRC deletes are not mirrored,
  and the bridge may borrow a same-named member's avatar. Automatic bridging is
  limited to public channels in configured categories.
- The archived Wikipedia, Urban Dictionary, IMDb and Imgur commands are not
  registered, so they are not disclosed as third-party lookups.

Follow-up TripBot changes the policy now depends on:

- TripSit/TripBot#1573 stops the public "Congratulate @member" course-completion
  post (the member only gets the role and a DM) and makes `/privacy get` point to
  `/levels` and `/remind_me get` instead of commands that do not exist.
- TripSit/TripBot#1575 makes `/privacy delete` delete every moderation action
  about the user, including the anonymized timer it used to keep for a temporary
  ban that had not ended. No ban record about the user remains in the database;
  that ban now stays until a moderator lifts it, and the confirmation warns about
  this. Ban and unban entries in the staff audit log channel are not searched.
- TripSit/TripBot#1572 fixes two retention bugs; the policy's ban and scheduling
  wording depends on it:
  - `checkEvery` waited a full interval before the first run, so the daily purge
    needed 24 hours of uptime and every restart reset it. Retention now polls
    hourly and runs once per UTC day, including after a restart; expired bans
    are checked hourly instead of every 12 hours.
  - Automatic temporary-ban lifts only cleared `expires_at`, leaving an
    "unrepealed" `FULL_BAN` that kept the user out of the purge and pruning
    forever. Lifts now set `repealed_at`, and the daily job repeals (or, for
    timer-only rows, deletes) full bans that Discord's ban list no longer
    contains.

## Website routes

The scoped policy now lives at `/tripbot/privacy`, with a permanent (308)
`/privacy` redirect for existing links. `/tripbot` introduces the verified bot
features and links directly to the policy. Navigation, footer, canonical metadata,
and sitemap use the new addresses; Reflect keeps its separate privacy policy.

Route-move validation: repository lint and the production build passed; all 573
website tests passed across 66 suites. HTTP checks confirmed 200 responses and
canonical URLs for both new routes and a 308 redirect preserving query parameters.
Browser checks confirmed the policy/back links, legacy fragment redirect, and
mobile layouts without horizontal overflow on either TripBot page.

## Reconciliation with website PR #478

PR #478's branch is merged into the combined overview/policy branch. Its lifecycle
record details and regression test are preserved at `/tripbot/privacy`, with the
old page kept deleted so the 308 redirect remains the only `/privacy` behavior.
The inspected `archiveTicket` code explicitly archives the support thread only;
`deleteTicket` removes both support and metadata threads. The combined policy
therefore does not promise automatic metadata-thread archiving. Retry-reference,
moderator-ID cleanup, lifecycle fields, and purge exclusions remain explicit.

Combined-branch validation after merging PR #478: repository lint and production
build passed; all 574 website tests passed across 66 suites.
