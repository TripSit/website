import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';

export default function CodeOfConduct() {
  return (
    <>
      <Head title="Code of Conduct" />
      <DefaultLayout heading="Code of Conduct">
        <h2 id="general-rules">General</h2>
        <ol type="I">
          <li>
            Listen and abide by specific staff requests.
            <ol type="i">
              <li>
                Moderation is applied on a contextual basis using the sensibilities of individual
                moderator&apos;s.
              </li>
              <li>
                Moderators should only remove people upon a refusal to comply with their requests.
              </li>
              <li>
                Do not count on the ability to apply technicalities to refute action taken against
                you.
              </li>
            </ol>
          </li>
          <li>
            No sourcing of drugs, or discussion around the use of dark net markets.
            <ol type="i">
              <li>
                This includes interactions initiating from TripSit that end up taking place in DM.
              </li>
              <li>
                It&apos;s best to follow this rule with a buffer as it&apos;s heavily enforced.
              </li>
              <li>
                This includes:
                <ul>
                  <li>Discussion of dark net markets</li>
                  <li>
                    Legal drugs, for example:
                    <ul>
                      <li>Research chemicals</li>
                      <li>Cannabis</li>
                      <li>Nicotine</li>
                      <li>Alcohol</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            Do not encourage drug use and other harmful behaviour.
            <ol type="i">
              <li>
                Do not ask for others to partake in drugs alongside you. It&apos;s fine to ask for
                company but they shouldn&apos;t be encouraged to use drugs to do so.
              </li>
              <li>
                Do not ask &ldquo;should I do <i>x</i> drug&rdquo; as it only serves to fish for
                validation. Exceptions to this are when determining doses or whether a drug
                combination is safe.
              </li>
            </ol>
          </li>
          <li>
            Do not post disturbing or unwanted content and in general, don&apos;t be a shit
            disturber.
          </li>
          <li>
            Do not intentionally give misleading or incorrect advice or information, even as a
            joke. <strong>Be prepared to provide reliable sources for anything you state as a
            fact.</strong>
            <ol type="i">
              <li>
                If you wish to claim credentials to back up a claim, be prepared to proove this
                on a video call with a staff member. Examples include:
                <ul>
                  <li>Doctor</li>
                  <li>Nurse</li>
                  <li>Lawyer</li>
                  <li>Medical student</li>
                  <li>Pharmacist</li>
                  <li>Therapist / counciller / social worker</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            Do not encourage others to participate in illegal or harmful behaviour.
          </li>
          <li>
            Do not campaign for the recruitment of any other networks that aren&apos;t in the
            spirit of harm reduction.
          </li>
        </ol>

        <h2 id="discord-rules">Discord</h2>
        <ol type="I">
          <li>
            Do not engage in the chat in any way while operating a motor vehicle.
          </li>
          <li>
            Do not use drugs, self-harm, or conduct illegal behaviour on camera.
          </li>
          <li>
            English is to be used should those within the room who don&apos;t know. If you wish to
            primarily speak in a different language we can arrange a room for you.
          </li>
        </ol>
      </DefaultLayout>
    </>
  );
}
