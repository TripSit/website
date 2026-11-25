import Link from "next/link";
import LegalPage from "../../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/tripbot/privacy"
      section={{ label: "TripBot", href: "/tripbot" }}
      description="What TripBot collects, how it uses and shares information, its retention and deletion limits, and how to contact TripSit about privacy."
      updated="25 November 2026"
    >
      <h2 id="TripSit's_Privacy_Policy">TripBot&apos;s Privacy Policy</h2>
      <p>
        TripSit operates TripBot, our community Discord bot. This policy
        describes TripBot&apos;s data handling, including its IRC bridge; it
        does not describe every TripSit website or service. Discord also
        processes information when you use Discord; its{" "}
        <a href="https://discord.com/privacy">privacy policy</a> applies to that
        processing.
      </p>

      <h3 id="Discord_Bot">TripBot on Discord</h3>
      <p>
        TripBot processes Discord information to provide community, support,
        safety, moderation, and other bot features. It stores some information
        in TripSit&apos;s database outside Discord.
      </p>

      <h4 className="mt-8 text-lg font-semibold text-ink">
        Information TripBot handles
      </h4>
      <ul>
        <li>
          <strong>Account and server information:</strong> your Discord user ID,
          username, server membership, selected role information, bot and ticket
          access restrictions, when you joined or left, and when and in which
          channel you were last seen. The bot uses member information for server
          features and moderation.
        </li>
        <li>
          <strong>Information you provide:</strong> profile choices such as
          timezone, birthday, and linked account names; information entered into
          commands and features such as reminders, dose records, support
          tickets, appeals, saved quotes and Best Of messages, temporary mindset
          role choices, and games. Dose records include the substance, amount,
          units, route, and recorded time; reminders include their text and
          scheduled time. Some features may involve sensitive personal
          information, including information about substance use.
        </li>
        <li>
          <strong>Community activity:</strong> reputation, engagement and
          experience counters, game scores, and related feature records
          generated through your use of community features.
        </li>
        <li>
          <strong>Moderation records:</strong> moderation actions and Discord
          IDs, descriptions, internal notes, moderator attribution, and timing
          information used to identify the affected user and enforce the action.
          Scheduled cleanup attempts to remove actions older than two years,
          except full-ban and ban-evasion records and actions concerning a user
          with an unrepealed full ban. Full-ban records are excluded even if the
          ban was temporary or later repealed. These excluded records have no
          automatic age-based expiry in this cleanup.
        </li>
        <li>
          <strong>Command usage statistics:</strong> aggregate lifetime totals
          and the most recent use time for each command. These totals are not
          linked to a user, server, or channel, and command option values are
          not stored in these statistics. They do not currently expire
          automatically.
        </li>
      </ul>
      <h3 id="Message_content">How TripBot uses Discord message content</h3>
      <p>
        TripBot reads message content to recognize and respond to text commands
        and to run its active message-driven features. These include replies and
        reactions, counting games, channel rules such as image-only posting,
        community activity features, and configured chat relays. Removing the
        IRC Bridge role stops relaying; it does not stop the other
        message-driven features from processing messages they can access.
      </p>
      <p>
        Text-command recognition and feature checks process message content
        transiently in memory to decide how to respond or act. These checks do
        not by themselves create a database archive of every message body.
        Discord client caches and relay queues can temporarily hold messages; a
        reply may also repeat part of your message on Discord. This is separate
        from the stored feature records described in this policy.
      </p>
      <p>
        Features can store content or information derived from it: for example,
        ticket and appeal details, saved quotes and Best Of copies, reminder
        text, dose records, and moderation records. Activity features can store
        counters and last-seen information without keeping the full message
        body. Operational logs can also contain personal information. Aggregate
        command statistics are separate from these records and logs. Stored
        records follow the{" "}
        <a href="#Retention">retention rules and exceptions below</a>;{" "}
        <a href="#Removing_your_information">deletion controls</a> do not erase
        every Discord reply, relayed copy, log, or backup.
      </p>
      <p>
        The active message handler does not call the AI moderation function.
        TripBot does not use Discord message content to train or fine-tune AI or
        machine-learning models. This does not mean that all AI processing is
        disabled: AI chat has been removed, but translation and RPG flair review
        remain available.
      </p>
      <p>
        Translation sends a selected message to OpenAI only if its author has
        agreed to both the AI terms and privacy policy. RPG flair review sends
        the submitted flair text to OpenAI. These features do not fetch
        conversation history or save their prompts and responses as AI message
        history in TripBot&apos;s database. AI consent timestamps remain linked
        to your profile and are included in successful profile deletion. Discord
        replies and any content saved as an RPG feature record are separate
        copies. Historical AI audit posts and replies on Discord, and copies
        held by providers, are not erased by removing AI chat or by deleting
        your TripBot profile.
      </p>
      <p>
        When configured, a separate developer-only maintenance feature can send
        an explicitly requested investigation or fix message to Anthropic&apos;s
        coding agent and open a resulting pull request on GitHub. It is not AI
        moderation of ordinary community messages. Provider and GitHub handling
        is separate from TripBot database deletion.
      </p>

      <h4 className="mt-8 text-lg font-semibold text-ink">IRC chat bridge</h4>
      <p>
        In configured shared channels, TripBot can relay messages between
        Discord and TripSit&apos;s IRC network. A member must have the{" "}
        <strong>IRC Bridge</strong> role for their Discord messages to be sent
        to IRC. Adding the role opts you in; removing it opts you out. The role
        is also removed during a successful <code>/privacy delete</code>.
      </p>
      <p>
        The bridge sends message text, including links to attachments, and a
        display name so people on the other network can see who wrote it.
        Discord edits are sent to IRC as an additional line marked as edited;
        IRC does not support changing the original line. When Discord messages
        are deleted, TripBot attempts to redact its IRC copies where the network
        supports redaction and TripBot still has the message mapping. That
        mapping is temporary and held in memory, so a restart or mapping expiry
        can prevent a later redaction attempt.
      </p>
      <p>
        Removing the IRC Bridge role, including during a successful{" "}
        <code>/privacy delete</code>, stops future relays, including queued
        messages that have not yet been delivered. TripBot checks the current
        role before sending each queued line. This does not guarantee removal of
        messages already sent to IRC. IRC servers may retain message history
        according to their own configuration, and IRC users may keep client
        logs, screenshots, or other copies. Even an IRC redaction is best
        effort: it cannot recall content already seen or copied, and clients
        that do not support redaction may still display it. TripSit operates the
        IRC network; removing TripBot database records does not erase IRC server
        history or copies retained by IRC users.
      </p>

      <h3 id="Removing_your_information">
        Viewing and deleting your information
      </h3>
      <p>
        Use <code>/privacy get</code> to see a summary of stored profile fields
        and counts of some feature records. It is not a complete data export and
        does not show every stored field or moderation record. Use{" "}
        <code>/privacy delete</code> to request deletion, then repeat it with
        the confirmation value <code>YesPlease!</code>. On success, the command
        deletes your profile and feature records, including dose and reminder
        records, linked accounts, ticket lifecycle records and appeals, their
        bot-managed Discord threads, saved Best Of copies, and moderation
        actions about you. It also removes your IRC Bridge role and deletes
        messages whose text contains your literal Discord ID from TripBot&apos;s
        bot-error and configured moderation log channels. This matching does not
        find every reference to you, such as a username or information inside an
        attachment.
      </p>
      <p>
        Privacy command replies are visible only to you by default. Setting
        their <code>ephemeral</code> option to <code>False</code> makes the
        reply visible to others in the channel. If Discord cleanup or database
        deletion fails, the command reports that deletion could not be
        completed. Some Discord cleanup may already have happened; do not treat
        an error as confirmation that your data was deleted. Contact{" "}
        <a href="mailto:privacy@tripsit.me">privacy@tripsit.me</a> for help.
      </p>
      <p>
        To remove individual records, use <code>/idose get</code> followed by{" "}
        <code>/idose delete</code>, or <code>/remind_me get</code> followed by{" "}
        <code>/remind_me delete</code>, selecting the record number shown in the
        list. These commands remove the selected database record; they do not
        recall messages or copies already delivered elsewhere. Using TripBot
        again can create new profile and feature records; deletion does not
        prevent future collection when you use the bot.
      </p>
      <p>
        When a moderation action about another user was recorded by you, TripBot
        removes your moderator attribution and the action&apos;s notes and
        description. The action may remain as part of the affected user&apos;s
        moderation history without those identifying details.
      </p>
      <p>
        If a temporary Discord ban is awaiting its automatic lift, TripBot
        retains only the target Discord ID, guild, and timing information needed
        to lift it. TripBot deletes that timer record after Discord confirms the
        unban. Deleting TripBot data does not reverse a Discord-managed server
        ban.
      </p>
      <p>
        Command statistics remain as aggregate totals and a most recent use time
        per command; they do not include user, guild, channel, or option data.
        This command does not remove ordinary Discord messages, copies held by
        other people, IRC content already relayed, or data in hosting logs and
        backups that TripBot cannot delete through Discord. TripBot has no
        command that erases hosting logs or backups and no bot-enforced expiry
        for those copies. Contact us about retention or deletion of those
        copies; this policy does not promise a fixed deletion period for them.
      </p>

      <h3 id="Retention">Scheduled retention and ticket cleanup</h3>
      <p>
        A scheduled job attempts to delete eligible Discord-linked profiles and
        their associated data after six months without recorded activity, using
        the same deletion process. Accounts with an unrepealed full ban are
        excluded, as are legacy profiles marked as already scrubbed. Production
        cleanup is scheduled daily; downtime or cleanup failures can delay
        removal. This is not a promise that every record disappears exactly six
        months after your last visit.
      </p>
      <p>
        When a due reminder is processed, the bot deletes its database record
        after attempting delivery, including when the DM cannot be sent. A
        reminder message already delivered through Discord is a separate copy.
      </p>
      <h4 className="mt-8 text-lg font-semibold text-ink">
        Support ticket retention
      </h4>
      <p>
        Ticket retention timers are set when a ticket is created, closed, or
        reopened. In production, TripBot archives the support thread after 3
        days and schedules deletion of both the support thread and its separate
        staff discussion thread after 6 days. Reopening or updating a ticket can
        refresh its deadlines; downtime or cleanup failures can delay removal.
        If Discord does not allow a deletion, TripBot keeps the references
        needed to retry, so removal may take longer. After both threads are
        removed, TripBot retains a minimal ticket lifecycle record linked to
        your account: ticket type, status, and creation, closure, reopen,
        archive, and deletion timestamps. It removes the Discord thread IDs,
        first message ID, and moderator IDs. This scheduled cleanup marks the
        ticket as deleted but does not erase the remaining database record. The
        record remains until a successful <code>/privacy delete</code> or the
        eligible inactive-account purge after six months without recorded
        activity, subject to the exclusions described above. There is no
        automatic 14-day database deletion rule for tickets.
      </p>

      <h3 id="Access">Who can see information</h3>
      <p>
        Discord channel and thread permissions determine who can see support
        conversations and moderation discussions, including participating
        support volunteers, moderators, and administrators with access. A
        private thread is not a promise of confidentiality from server
        administrators. TripBot&apos;s database and hosting infrastructure can
        also be accessed by their operators with the relevant technical
        permissions. Messages relayed to IRC are visible to recipients there.
      </p>

      <h3 id="Contact">Contact and privacy requests</h3>
      <p>
        Email <a href="mailto:privacy@tripsit.me">privacy@tripsit.me</a> with
        privacy questions or requests to access, correct, or delete your
        information. You can use this address if you cannot use the bot,
        including if you have left Discord or are banned. Include enough
        information to identify the relevant account; we may need to verify that
        it belongs to you before acting on a request.
      </p>

      <h3 id="Other_TripSit_services">Other TripSit services</h3>
      <p>
        Some TripSit services have separate data practices. This policy section
        describes TripBot and should not be read as a description of the
        separate Reflect app. See{" "}
        <Link href="/reflect/privacy">Reflect&apos;s privacy policy</Link> for
        that app.
      </p>

      <h3 id="Changes">Changes to this policy</h3>
      <p>
        We will update this page when TripBot&apos;s data handling changes. The
        date at the top shows when this page was last updated.
      </p>
    </LegalPage>
  );
}
