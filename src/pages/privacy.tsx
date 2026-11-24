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
          <strong>Moderation records:</strong> moderation actions and the
          Discord IDs needed to enforce them, including bans. These records are
          kept separately from ordinary profile and feature data.
        </li>
        <li>
          <strong>Command usage statistics:</strong> command names, times,
          server and channel IDs, and a limited set of command parameter values.
          These records do not include a Discord user ID. Parameter values are
          deleted after 90 days; the command usage records themselves do not
          currently have an automatic deletion period.
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
        display name so people on the other network can see who wrote it. Edits
        and deletions are relayed where the receiving network supports them. IRC
        is a separate service: TripBot cannot remove copies that other people or
        IRC services may have retained. The IRC network&apos;s own operators and
        users handle data under their own practices.
      </p>

      <h3 id="Removing_your_information">
        Viewing and deleting your information
      </h3>
      <p>
        Use <code>/privacy get</code> to see the profile and feature information
        TripBot currently associates with your account. Use{" "}
        <code>/privacy delete</code> to request deletion of that information.
        The command deletes your ordinary profile and feature records, including
        dose and reminder records, linked accounts, tickets and appeals, their
        bot-managed Discord threads, and your saved Best Of archive copies. It
        also removes your IRC Bridge role. You can opt out of the bridge at any
        time by removing that role yourself.
      </p>
      <p>
        Moderation actions and the Discord ID used to enforce them are retained
        after <code>/privacy delete</code>. Non-permanent moderation actions are
        retained for up to two years. Permanent bans, ban-evasion records, and
        actions associated with an active full ban are retained while needed for
        ban enforcement. Discord&apos;s own server ban is separate from
        TripBot&apos;s database and is not reversed by deleting bot data.
      </p>
      <p>
        For accounts that have not been seen for six months, TripBot
        automatically deletes ordinary profile and feature data, unless the
        account has an active full ban. Command parameter values are deleted
        after 90 days. The command usage statistics described above currently
        have no automatic expiry.
      </p>
      <p>
        Deletion cannot remove messages you posted in Discord, copies held by
        other people, or content another service has already retained after it
        was relayed. Moderation records may remain as described above.
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
