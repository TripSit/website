import LegalPage from "../../components/reflect/LegalPage";

export default function ReflectPrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="15 November 2026"
      description="What Reflect - Experience Journal, TripSit's harm-reduction journal for Android, stores, where it goes, and how to remove it."
    >
      <p>
        Reflect - Experience Journal (&ldquo;Reflect&rdquo;) is a harm-reduction
        journal for Android, published on Google Play by Sympact06. This policy
        says what Reflect stores, where it goes, and how to remove it.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>
          Everything you enter stays on your phone. Reflect has no account, no
          server and no internet access of its own.
        </li>
        <li>
          Reflect has no ads, no analytics and no tracking, and it never sells
          or shares your data.
        </li>
        <li>
          Two parts of Android that Reflect uses can send data off the phone:
          the place-name lookup, when you add a location, and Android&apos;s own
          backup, if you have it turned on. Both are described below.
        </li>
      </ul>

      <h2>What Reflect stores</h2>
      <p>
        Reflect keeps the following on your phone, in the app&apos;s private
        storage:
      </p>
      <ul>
        <li>
          Your journal: sessions, substances, doses, routes, times, mood,
          setting, notes, ratings and session names. If you log a dose for
          someone else, the name you type for them is stored too.
        </li>
        <li>
          Locations you add to sessions: a place name and its coordinates.
        </li>
        <li>
          Substances you create or edit yourself, and your notes on substances.
        </li>
        <li>Your settings.</li>
        <li>
          Rolling backup copies of your journal, so that a damaged database can
          be recovered.
        </li>
        <li>
          If you turn on Developer Mode, a diagnostic log of what the app did.
        </li>
      </ul>
      <p>None of this leaves your phone through Reflect.</p>

      <h2>Location</h2>
      <p>
        Location is optional. Reflect reads it only when you tap &ldquo;Use
        Current&rdquo; in the location field, or when you turn on &ldquo;Add
        Location Automatically&rdquo; in Settings. Both show an explanation
        first, then Android asks for permission. Reflect reads your location
        only while you are using the app, never in the background.
      </p>
      <p>
        To find where you are, Reflect asks Android&apos;s location service,
        which on most phones is part of Google Play services. To turn
        coordinates into a place name, and to answer the location search,
        Android&apos;s place-name lookup is used. On most phones it is run by
        Google Play services or by the phone&apos;s maker, and it receives your
        coordinates, or the text you typed into the search. Their own privacy
        terms cover what they do with it. Reflect itself does not send it
        anywhere.
      </p>
      <p>
        Automatically added locations are rounded to about 1 km before they are
        saved, unless you turn on &ldquo;Use Exact Location&rdquo;. If you never
        add a location, no location is read.
      </p>

      <h2>Data that leaves your phone, and only when you choose</h2>
      <ul>
        <li>
          <strong>Export:</strong> Reflect writes your journal to a file at the
          place you pick. Where it goes from there is up to you.
        </li>
        <li>
          <strong>Developer Mode log:</strong> the share button hands the log to
          the app you choose.
        </li>
        <li>
          <strong>Links:</strong> opening a web page (TripSit, DoseWiki, a
          source article) or showing a session&apos;s place on a map opens
          another app, such as your browser or maps app. That app&apos;s privacy
          terms apply.
        </li>
      </ul>

      <h2>Android backup</h2>
      <p>
        Reflect allows Android&apos;s system backup. If backup is turned on for
        your phone, Android copies Reflect&apos;s journal and settings into it,
        which on most phones means your Google account, and moves them to a new
        phone when you transfer. Reflect&apos;s rolling backup copies are left
        out. You control this in your phone&apos;s settings; Reflect does not
        upload anything itself.
      </p>

      <h2>Screen lock and notifications</h2>
      <p>
        Privacy Mode asks for your screen lock, fingerprint or face before the
        app opens. Android checks it; Reflect never sees your fingerprint, face
        or PIN.
      </p>
      <p>
        Reminders and phase alerts are scheduled on the phone and never pass
        through a server. With Privacy Mode on, they are hidden from the lock
        screen.
      </p>

      <h2>Keeping and deleting your data</h2>
      <p>
        Your data stays until you delete it. You can delete a single entry, note
        or session in the app. Settings &rsaquo; Delete All Data erases the
        whole journal, your own substances, the backup copies, the settings and
        the Developer Mode log. Uninstalling Reflect also erases everything on
        the phone; a copy in Android&apos;s backup follows your phone&apos;s
        backup settings.
      </p>

      <h2>Age</h2>
      <p>
        Reflect is meant for adults (18 and over) and is not directed at
        children.
      </p>

      <h2>Not medical advice</h2>
      <p>
        Reflect&apos;s substance information is for harm reduction and
        education. It is not medical advice and Reflect is not a medical device.
        Talk to a healthcare professional about your health.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        When this policy changes, the new version ships with the app and the
        date at the top changes.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a href="mailto:reflect@aero.nu">reflect@aero.nu</a>
      </p>
    </LegalPage>
  );
}
