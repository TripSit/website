import { Image } from 'react-bootstrap';
import Head from '../components/head';
import DefaultLayout from '../components/layouts/default';

export default function AboutPage() {
  return (
    <>
      <Head title="About" />
      <DefaultLayout heading="About">
        <p>
          In today&apos;s world its not hard to see the divide; people living their lives,
          experiencing their world and all too often never reaching out to help one another.
          We believe that the time has come to break the taboos associated with drug use and
          to provide people with the resources they need in order to stay safe.
        </p>
        <Image src="/images/about-us-statue.png" alt="Shamanic statue" fluid />
        <p>
          <strong>We are TripSit</strong> &ndash; Our mission is to provide open discussion of harm
          reduction techniques and positive support. We promote the use of harm reduction tools
          such as test kits, and offer guidance and support with regards to harm reduction when
          using drugs. We encourage discussion of scientific, medical, philosophical
          understandings, and many of us can provide advice based on life experiences, an
          invaluable asset for someone who may be experiencing a similar issue. We are eager,
          willing, and prepared to guide or &lsquo;tripsit&rsquo; users who may be having a hard
          time while under the influence of drugs.
        </p>
        <p>
          Our experienced team understands the good and bad side of drugs and we understand that
          individuals will use drugs regardless of their current legality. Its for that reasons
          that we are here to help by reducing the risks associated with reckless or uninformed
          consumption of drugs in all environments while providing support and assistance to those
          who need it. Whether you need someone to talk to, advice on safe dosage, a simple water
          bottle, or supportive techniques for recovery we are here for you.
        </p>
        <p>
          Our network is comprised of an IRC chat team dedicated to 24/7 live support from quick
          information to a friendly guide through difficult experience. We also offer a
          drug-information wiki for those seeking quick information and a live radio service for
          those seeking musical company.
        </p>
        <p>
          Overall, the TripSit team is here to help you stay safe as possible if you choose to use
          substances. Even though we are not trained professionals, we are unpaid volunteers that
          take the time out of our day to support people in need. We are here for you. Whether you
          need information, someone to answer questions without judgement, a testing kit, or just a
          place to hang out and talk with friends we hope to be there.
        </p>
        <p>
          We live in a day and age where the influence of drugs is as present in our lives as it
          has ever been and we strongly believe that there is a need to ensure that people have
          the same ease-of-access to the information and supplies needed to stay safe. So, from
          all of us here at TripSit: Stay safe, and learn.
        </p>

        <h2 id="additional-information">Additional Information</h2>
        <ul>
          <li>
            We do not encourage the use or abuse of drugs. On the contrary: users who join our
            network are already intent on taking drugs, and we provide services to keep them safe.
            We do not condone the abuse of drugs or mixing of potentially dangerous combinations of
            drugs.
          </li>
          <li>
            Our number one goal is to provide positive support and encourage harm reduction by
            providing techniques, advice, and in some cases, helping users deal with possible
            negative psychological consequences of their actions and experiences.
          </li>
          <li>
            We have a zero tolerance policy on the abuse of dangerous drugs and any discussion of
            suicide or other psychological issues, and we do remove rule breakers from the community
            to ensure they do not become a bad influence on others.
          </li>
          <li>
            There is often a conflation
            between a &lsquo;bad trip&rsquo; and a medical emergency apparent with expert
            testimonials given in news reports. A bad trip refers to a situation in which
            someone may be feeling panicked, depressed, anxious, or upset while under the
            influence of psychotropic drugs and would like somebody to talk to in a supportive,
            positive, and relaxing environment.
          </li>
          <li>
            <strong>TripSit is not intended to be a replacement for medical help, as we are not
            medical professionals.</strong> We strive to provide advice
            and positive support to users who are already engaged in drug use. We provide
            information concerning the consequences, side effects, and addictive properties of
            using and/or mixing potentially harmful drugs.
          </li>
        </ul>
      </DefaultLayout>
    </>
  );
}
