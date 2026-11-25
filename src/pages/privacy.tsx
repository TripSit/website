import Link from "next/link";
import LegalPage from "../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      description="What TripSit and TripBot collect, how they use and share it, how long they keep it, and how to request deletion."
      updated="24 November 2026"
    >
      <h2 id="TripSit's_Privacy_Policy">TripSit&apos;s Privacy Policy</h2>
      <p>
        This policy describes information handled by TripSit services, including
        TripBot, our Discord bot. Discord also processes information when you
        use Discord; its own privacy policy applies to that processing.
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
          username, server membership and selected role information, and
          timestamps such as when you joined or were last seen. The bot uses
          member information for server features and moderation.
        </li>
        <li>
          <strong>Information you provide:</strong> profile choices such as
          timezone, birthday, and linked account names; information entered into
          commands and features such as reminders, dose records, support
          tickets, appeals, and games. Some features may involve sensitive
          personal information, including information about substance use.
        </li>
        <li>
          <strong>Moderation records:</strong> moderation actions and Discord
          IDs used to identify the affected user and enforce the action. In
          ordinary operation, non-permanent actions are kept for up to two
          years; permanent bans, ban-evasion records, and actions concerning a
          currently banned user may be kept longer as needed for moderation.
        </li>
        <li>
          <strong>Command usage statistics:</strong> aggregate lifetime totals
          and the most recent use time for each command. These totals are not
          linked to a user, server, or channel, and command option values are
          not stored in these statistics. They do not currently expire
          automatically.
        </li>
      </ul>
      <p>
        TripBot does not keep a general archive of Discord messages. It reads
        message content when needed to operate message-based features, including
        configured chat relays. Message content used for these features is not
        used to train AI or machine-learning models. TripBot&apos;s AI chat
        feature is currently disabled.
      </p>

      <h4 className="mt-8 text-lg font-semibold text-ink">IRC chat bridge</h4>
      <p>
        In configured shared channels, TripBot can relay messages between
        Discord and TripSit&apos;s IRC network. A member must have the
        <strong> IRC Bridge</strong> role for their Discord messages to be sent
        to IRC. Adding the role opts you in; removing it opts you out. The role
        is also removed when you use <code>/privacy delete</code>.
      </p>
      <p>
        The bridge sends message text, including links to attachments, and a
        display name so people on the other network can see who wrote it.
        Discord edits are sent to IRC as an additional line marked as edited;
        IRC does not support changing the original line. When Discord messages
        are deleted, TripBot attempts to redact its IRC copies where the
        network supports redaction and TripBot still has the message mapping.
        That mapping is temporary and held in memory, so a restart or mapping
        expiry can prevent a later redaction attempt.
      </p>
      <p>
        Removing the IRC Bridge role or using <code>/privacy delete</code>
        stops future relays, but does not guarantee removal of messages already
        sent to IRC. IRC servers may retain message history according to their
        own configuration, and IRC users may keep client logs, screenshots, or
        other copies. Even an IRC redaction is best effort: it cannot recall
        content already seen or copied, and clients that do not support
        redaction may still display it. The IRC network&apos;s operators and
        users handle data under their own practices.
      </p>

      <h3 id="Removing_your_information">
        Viewing and deleting your information
      </h3>
      <p>
        Use <code>/privacy get</code> to see the profile and feature information
        TripBot currently associates with your account. Use{" "}
        <code>/privacy delete</code> to request deletion. The command deletes
        your profile and feature records, including dose and reminder records,
        linked accounts, tickets and appeals, their bot-managed Discord threads,
        saved Best Of copies, and moderation actions about you. It also removes
        your IRC Bridge role and deletes messages containing your Discord ID
        from TripBot&apos;s bot-error and configured moderation log channels.
      </p>
      <p>
        When a moderation action about another user was recorded by you,
        TripBot removes your moderator attribution and the action&apos;s notes
        and description. The action may remain as part of the affected user&apos;s
        moderation history without those identifying details.
      </p>
      <p>
        If a temporary Discord ban is awaiting its automatic lift, TripBot
        retains only the target Discord ID, guild, and timing information
        needed to lift it. TripBot deletes that timer record after Discord
        confirms the unban. Deleting TripBot data does not reverse a
        Discord-managed server ban.
      </p>
      <p>
        Command statistics remain as aggregate totals and a most recent use
        time per command; they do not include user, guild, channel, or option
        data. Deletion cannot remove ordinary Discord messages, copies held by
        other people, IRC content already relayed, or data in hosting logs and
        backups that TripBot cannot delete through Discord. Hosting log and
        backup retention depends on the service configuration.
      </p>
      <p>
        For accounts that have not been seen for six months, TripBot
        automatically deletes ordinary profile and feature data, unless the
        account has an active full ban.
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
