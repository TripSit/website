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
        describes TripBot&apos;s data handling, including its IRC bridge and the
        ban appeals that the TripSit website stores through TripBot; it does not
        describe every TripSit website or service. Discord also processes
        information when you use Discord; its{" "}
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
          username, server membership, selected role information, bot, ticket,
          and helper or contributor role restrictions, when your TripBot profile
          was created, when you left the server, and when you were last active.
          Older profiles may also hold the channel you were last seen in.
          TripBot creates a profile automatically when you send a message in the
          TripSit Discord server or in a direct message to TripBot, or use a
          TripBot command in the TripSit server; commands that look up or save
          your information create one wherever they are used. The bot uses
          member information for server features and moderation.
        </li>
        <li>
          <strong>Information you provide:</strong> profile choices such as
          timezone, birthday, and linked account names; information entered into
          commands and features such as reminders, dose records, support
          tickets, appeals, saved quotes and Best Of messages, temporary mindset
          role choices, and games. Dose records include the substance, amount,
          units, route, and recorded time; reminders include their text and
          scheduled time. Some features may involve sensitive personal
          information, including information about substance use. If you set a
          birthday, TripBot posts a birthday greeting that mentions you in a
          server channel on that day. If you link an account on TripSit&apos;s
          learning site, TripBot regularly checks it for completed courses,
          gives you the matching Discord role, and sends you a direct message.
          Course completions are not announced in the server.
        </li>
        <li>
          <strong>Community activity:</strong> reputation, engagement and
          experience counters, game scores, and related feature records
          generated through your use of community features. For helpers, TripBot
          records when they were last active in the harm reduction channels. For
          code contributors, it records claimed GitHub bounties: the pull
          request and issue reference and the amount awarded.
        </li>
        <li>
          <strong>Moderation records:</strong> moderation actions and reports,
          Discord IDs, descriptions, internal notes, moderator or reporter
          attribution, and timing information used to identify the affected user
          and enforce the action. Moderators can also ask TripBot to notify
          them, by direct message or in a channel they choose, the next time a
          member posts; TripBot keeps the request until that notification is
          sent, and the notification names the channel the member posted in.
          Scheduled cleanup attempts to remove actions older than two years,
          except full-ban and ban-evasion records and actions concerning a user
          who is currently banned. A full ban stops counting as current when a
          moderator lifts it, when TripBot lifts it at the end of a temporary
          ban, or when TripBot&apos;s daily check finds that Discord no longer
          has the ban. Full-ban records are excluded even if the ban was
          temporary or later repealed. These excluded records have no automatic
          age-based expiry in this cleanup.
        </li>
        <li>
          <strong>Staff log entries:</strong> TripBot posts records of
          moderation actions and reports, members leaving, role changes, and
          voice channel joins, moves, and departures to staff-only Discord log
          channels. These entries identify you by mention, display name, or
          Discord ID.
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
        community activity features, moderators&apos; watch notifications, and
        configured chat relays. Removing the IRC Bridge role stops relaying; it
        does not stop the other message-driven features from processing messages
        they can access.
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
        is separate from TripBot database deletion. When staff reject a TripBot
        pull request from Discord, TripBot posts their display name and comment
        publicly on GitHub.
      </p>

      <h4 className="mt-8 text-lg font-semibold text-ink">IRC chat bridge</h4>
      <p>
        In shared channels, TripBot can relay messages between Discord and
        TripSit&apos;s IRC network. Shared channels are the channels staff set
        up for relaying and the public channels in configured categories of the
        TripSit server; private channels are never shared automatically. A
        member must have the <strong>IRC Bridge</strong> role for their Discord
        messages to be sent to IRC. Adding the role opts you in; removing it
        opts you out. The role is also removed during a successful{" "}
        <code>/privacy delete</code>.
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
      <p>
        Messages sent on IRC in a shared channel are posted to Discord under the
        sender&apos;s IRC nickname; IRC users do not need to opt in. Deleting a
        message on IRC does not delete its Discord copy. When an IRC nickname
        matches a Discord member&apos;s name, the relayed message may show that
        member&apos;s Discord avatar.
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
        records, linked accounts, game scores and RPG character, quotes of you
        and quotes you saved, bounty claims, moderators&apos; watch requests
        about you or made by you, ticket lifecycle records and appeals, their
        bot-managed Discord threads, the moderators&apos; discussion thread
        about you, saved Best Of copies, and moderation actions about you. It
        also removes your IRC Bridge role and deletes messages that contain your
        literal Discord ID, in their text or embeds, from TripBot&apos;s bot
        log, bot-error, and moderation log channels. This matching does not find
        every reference to you, such as a display name, username, or information
        inside an attachment, and it does not search the staff audit log channel
        that records role changes, voice channel activity, and bans and unbans.
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
        recall messages or copies already delivered elsewhere. Sending a message
        in the TripSit server or to TripBot, or using TripBot again, creates a
        new profile and can create new feature records; deletion does not
        prevent future collection.
      </p>
      <p>
        When a moderation action about another user was recorded by you, TripBot
        removes your moderator attribution and the action&apos;s notes and
        description. The action may remain as part of the affected user&apos;s
        moderation history without those identifying details.
      </p>
      <p>
        After a successful deletion, TripBot&apos;s database keeps no ban
        records about you. If you have a temporary Discord ban that has not
        ended, deletion also removes the timer TripBot uses to lift it, so
        TripBot can no longer lift that ban automatically: it stays in place
        until a moderator lifts it. The confirmation step warns you about this.
        Deleting TripBot data does not reverse a Discord-managed server ban.
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
        the same deletion process. Accounts that are currently banned, as
        described under moderation records, are excluded, as are legacy profiles
        marked as already scrubbed. TripBot checks hourly and runs this cleanup
        once a day: at the first check after midnight UTC, and at the first
        check after each restart. Downtime or cleanup failures can delay
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
        archive, and deletion timestamps, plus the timestamps it uses to track
        when a response was due, when the team responded, and when it sent
        reminders. It removes the Discord thread IDs, first message ID, and
        moderator IDs. This scheduled cleanup marks the ticket as deleted but
        does not erase the remaining database record. The record remains until a
        successful <code>/privacy delete</code> or the eligible inactive-account
        purge after six months without recorded activity, subject to the
        exclusions described above. There is no automatic 14-day database
        deletion rule for tickets.
      </p>

      <h3 id="Access">Who can see information</h3>
      <p>
        Discord channel and thread permissions determine who can see support
        conversations and moderation discussions, including participating
        support volunteers, moderators, and administrators with access. A
        private thread is not a promise of confidentiality from server
        administrators. Staff log channels are visible to the staff who can open
        them. Staff who review appeals can also see appeal answers and ban
        status on the TripSit website&apos;s staff dashboard after signing in.
        TripBot&apos;s database and hosting infrastructure can also be accessed
        by their operators with the relevant technical permissions. Messages
        relayed to IRC are visible to recipients there.
      </p>

      <h3 id="Website_appeals">Ban appeals on the TripSit website</h3>
      <p>
        To appeal a ban on the TripSit website, you sign in with a TripSit
        account linked to Discord. TripBot uses that sign-in to find your
        Discord ID, checks your ban status with Discord, and stores your appeal
        answers with your TripBot profile. It posts the appeal to the
        moderators&apos; Discord discussion thread about you, and staff can also
        review and decide appeals on the website&apos;s staff dashboard. Appeal
        records follow the viewing, deletion, and retention rules in this
        policy.
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
