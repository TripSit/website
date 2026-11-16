import Link from "next/link";
import LegalPage from "../../components/reflect/LegalPage";

export default function ReflectTermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="15 November 2026"
      path="/reflect/terms"
      description="The terms that apply when you use Reflect - Experience Journal, TripSit's harm-reduction journal for Android."
    >
      <p>
        These terms cover Reflect - Experience Journal (&ldquo;Reflect&rdquo;),
        a harm-reduction journal for Android, published on Google Play by
        Sympact06 and built by Sympact and Ruubert as a TripSit project. By
        using Reflect you agree to them. If you do not agree, do not use the
        app.
      </p>

      <h2>Who Reflect is for</h2>
      <p>
        Reflect is for adults (18 and over). Do not use it if you are younger.
      </p>

      <h2>What Reflect is, and is not</h2>
      <p>
        Reflect lets you record substance use and see an estimated effect
        timeline. It is a harm-reduction tool. It does not encourage the use of
        any substance, and it does not make anything legal that is illegal where
        you are.
      </p>
      <p>
        Reflect is not medical advice and not a medical device. Dosage,
        duration, interaction and other substance information comes from
        community-maintained sources (DoseWiki, and TripSit&apos;s interaction
        ratings). It can be incomplete, out of date or wrong, and effect
        timelines are estimates. Do not rely on Reflect alone to decide what to
        take, how much, or when. Talk to a healthcare professional about your
        health. In an emergency, call your local emergency number.
      </p>

      <h2>Price</h2>
      <p>
        Reflect is free. It has no ads, no in-app purchases and no
        subscriptions.
      </p>

      <h2>Your data</h2>
      <p>
        Everything you enter stays on your phone, and you are responsible for
        it, including keeping exports or backups if you want them. Uninstalling
        Reflect or using Delete All Data erases it. The privacy policy explains
        what Reflect stores and where it can go:{" "}
        <Link href="/reflect/privacy">https://tripsit.me/reflect/privacy</Link>
      </p>

      <h2>Using the app and its source code</h2>
      <p>
        You may use Reflect for any lawful, non-commercial purpose. Its source
        code is published under the{" "}
        <a href="https://polyformproject.org/licenses/noncommercial/1.0.0/">
          PolyForm Noncommercial License 1.0.0
        </a>
        {","} which sets out what you may do with the code. The bundled
        substance data keeps its own sources&apos; licences.
      </p>

      <h2>No warranty</h2>
      <p>
        Reflect is provided as is and as available, without any warranty, as far
        as the law allows. We do not promise that it is free of errors, that it
        will always work, or that its information is accurate or complete.
      </p>

      <h2>Liability</h2>
      <p>
        As far as the law allows, we are not liable for any harm or loss arising
        from your use of Reflect, from relying on its information, or from
        losing data stored in it. Nothing in these terms limits any right you
        have under consumer protection law that cannot be limited by agreement.
      </p>

      <h2>Changes</h2>
      <p>
        We may update Reflect and these terms. When the terms change, the date
        at the top changes. If you keep using Reflect after a change, the new
        terms apply.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:reflect@aero.nu">reflect@aero.nu</a>
      </p>
    </LegalPage>
  );
}
