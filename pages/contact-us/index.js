import Link from 'next/link';
import Head from '../../components/head';
import DefaultLayout from '../../components/layouts/default';

export default function ContactPage() {
  return (
    <>
      <Head title="Contact Us" />
      <DefaultLayout heading="Contact Us">
        <p>
          We&apos;re always here to listen to feedback or any questions users have. To help direct
          your message to the right person, please choose the most relevant option below.
        </p>
        <ul>
          <li>
            <Link href="/contact-us/bans">
              Ban Appeals
            </Link>
          </li>
          <li>
            <Link href="/contact-us/substances">
              Substance Questions &amp; Suggestions
            </Link>
          </li>
          <li>
            <Link href="/contact-us/irc">
              IRC Questions &amp; Suggestions
            </Link>
          </li>
          <li>
            <Link href="/apply">
              I&apos;d like to apply for staff / volunteer
            </Link>
          </li>
          <li>
            <Link href="/contact-us/media">
              I am a media represenative looking to do a story / article
            </Link>
          </li>
          <li>
            <Link href="/contact-us/sales">
              I have SEO / page-view / sales opportunities
            </Link>
          </li>
        </ul>
      </DefaultLayout>
    </>
  );
}
