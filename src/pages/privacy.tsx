import LegalPage from "../components/LegalPage";

// Migrated from https://wiki.tripsit.me/index.php?title=Privacy_Policy&oldid=5929 (wording preserved).
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      description="What TripSit stores about your activities on its servers and how to remove your information."
      updated="11 January 2023"
    >
      <h2 id="TripSit&#x27;s_Privacy_Policy">TripSit&#x27;s Privacy Policy</h2>
      <p>
        TripSit may store data about your activities on our servers. This page
        details what type of info we store and how to remove it.
      </p>
      <h3 id="Discord_Bot">Discord Bot</h3>
      <p>
        In order to provide you with excellent features, TripSit&#x27;s Discord
        bot, TripBot, stores information in a database. All this information is
        either publicly available to other users or optionally given by
        yourself.
      </p>
      <h4 className="mt-8 text-lg font-semibold text-ink" id="User-submitted:">
        User-submitted:
      </h4>
      <p>Information submitted by users includes:</p>
      <ol>
        <li>timezone - Submitted via /timezone</li>
        <li>birthday - Submitted via /timezone</li>
        <li>
          mindset_role - If you picked a Mindset role, this is what you picked
        </li>
        <li>
          mindset_role_expires_at - This is 8 hours from when you picked up the
          mindset_role
        </li>
        <li>
          karma_given - How many times you&#x27;ve used the upvote on someone
          else
        </li>
        <li>
          karma_received - How many times has someone used the upvote on you
        </li>
        <li>
          sparkle_points - How many times have you clicked the Hydrate emoji
        </li>
        <li>move_points - How many times have you clicked the Move emoji</li>
        <li>
          empathy_points - How many times have you clicked the Empathy emoji
        </li>
      </ol>
      <h4
        className="mt-8 text-lg font-semibold text-ink"
        id="Automatically-collected:"
      >
        Automatically-collected:
      </h4>
      <p>The bot will automatically record certain fields:</p>
      <ol>
        <li>roles - The roles you have on the TripSit guild</li>
        <li>discord_bot_ban - Is your user banned from using the bot?</li>
        <li>ticket_ban - Is your user banned from using tickets?</li>
        <li>last_seen_at - When were you last seen?</li>
        <li>last_seen_in - What channel were you last seen in?</li>
        <li>joined_at - When did you join the guild?</li>
        <li>removed_at - When were you removed from the guild?</li>
      </ol>
      <h4 className="mt-8 text-lg font-semibold text-ink" id="Idoses:">
        Idoses:
      </h4>
      <p>
        Users may use the /idose command to store dosage information, such as:
      </p>
      <ol>
        <li>user_id - Your DB ID, is not human-readable</li>
        <li>
          drug_id - The ID of the substance you took, is not human-readable
        </li>
        <li>route - The RoA that the substance was taken</li>
        <li>dose - The dosage of the substance</li>
        <li>units - The units of that dosage</li>
        <li>created_at - When this dosage was taken</li>
      </ol>
      <p>
        <b>
          Idose records can be individually removed with the /idose remove
          command.
        </b>
      </p>
      <h4 className="mt-8 text-lg font-semibold text-ink" id="Reminders:">
        Reminders:
      </h4>
      <p>
        Users may use the /reminder command to remind themselves of something in
        the future:
      </p>
      <ol>
        <li>user_id - Your DB ID, is not human-readable</li>
        <li>reminder_text - The reminder to be sent to the user</li>
        <li>trigger_at - When should this be sent</li>
        <li>created_at - When this was created</li>
      </ol>
      <p>
        <b>
          Reminders can be individually removed with the /reminder remove
          command
        </b>
        Reminders are deleted once the user is reminded.<b></b>
      </p>
      <h4 className="mt-8 text-lg font-semibold text-ink" id="Tickets:">
        Tickets:
      </h4>
      <p>We store the following fields on user-submitted tickets:</p>
      <ol>
        <li>user_id - Your DB ID, is not human-readable</li>
        <li>description - The initial issue that was submitted by the user</li>
        <li>thread_id - The thread that was opened for this issue</li>
        <li>
          meta_thread_id - (Optional) if a meta-thread was created about this
          issue
        </li>
        <li>
          type - The type of issue submitted. Can be one of Ban Appeal, TripSit
          Session, Tech Help, and Feedback
        </li>
        <li>
          status - The status of the issue, E.G., &quot;open&quot; or
          &quot;resolved&quot;
        </li>
        <li>
          first_message_id - The ID of the first message sent in the thread
        </li>
        <li>closed_by - Who closed the issue</li>
        <li>closed_at - When the issue was closed</li>
        <li>reopened_by - Who reopened the issue</li>
        <li>reopened_at - When the issue was reopened</li>
        <li>archived_at - When the issue will be archived</li>
        <li>deleted_at - When the issue will be deleted</li>
        <li>created_at - When this issue was created</li>
      </ol>
      <p>
        <b>Issue information is deleted from the DB after 14 days.</b>
      </p>
      <h2 id="Removing_your_information">Removing your information</h2>
      <p>
        You can use the /privacy command to see the data we have on your user,
        and if desired, you can remove that information. This will remove all
        information we store on you, except for moderation actions associated
        with your discord ID. IE: You can delete all your personal information,
        but you can’t delete bans, warnings or reports.
      </p>
      <p>
        Moved from the{" "}
        <a href="https://wiki.tripsit.me/index.php?title=Privacy_Policy&amp;oldid=5929">
          TripSit Wiki privacy policy
        </a>
        ; policy wording preserved.
      </p>
    </LegalPage>
  );
}
