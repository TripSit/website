import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Tooltip } from "@mui/material";
import { Inter, Space_Grotesk } from "next/font/google";
import JoinInnerOutlinedIcon from "@mui/icons-material/JoinInnerOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import axios from "axios";
import { APIGuild } from "discord-api-types/v10";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";
import bluelightLogo from "../../public/assets/img/logos/bluelight.jpg";
import seiLogo from "../../public/assets/img/logos/sei.png";
import rdrugsLogo from "../../public/assets/img/logos/rdrugs.png";
import pwLogo from "../../public/assets/img/logos/pw.png";
import mapsLogo from "../../public/assets/img/logos/maps.png";
import dancesafeLogo from "../../public/assets/img/logos/dancesafeYellow.png";
import comboChart from "../../public/assets/img/comboChart.png";
import logo from "../../public/assets/img/logo.png";
import Ghost from "../components/Ghost";
import Particles from "../components/Particles";
import Counter from "../components/Counter";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const accordionItemClassNames = {
  // hairline divider as box-shadow: border utilities lose the cascade fight
  // against bootstrap's border rules here
  base: "shadow-[0_1px_0_0_rgba(42,49,82,0.6)] last:shadow-none",
  // flex collapses the h2 heading slot to the trigger height (bootstrap's
  // heading font-size otherwise adds a phantom line box)
  heading: "m-0 flex",
  // appearance/background/border resets: no Tailwind preflight here, so the
  // trigger <button> keeps its grey UA chrome unless stripped explicitly
  trigger:
    "appearance-none [background:none] [border:none] [font:inherit] w-full flex items-center gap-4 py-4 text-left cursor-pointer transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
  titleWrapper: "flex-1",
  title: "font-display text-lg md:text-xl font-medium text-ink",
  indicator:
    "text-mute text-2xl transition-transform data-[open=true]:-rotate-90",
  content:
    "pb-6 space-y-4 text-mute leading-relaxed [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2 [&_b]:text-ink [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-ink [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1",
};

const accStart = (glyph: string) => (
  <span
    aria-hidden
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet/15 font-display text-base text-violet"
  >
    {glyph}
  </span>
);

function Section({
  id,
  title,
  lead,
  tint = false,
  children,
}: {
  id: string;
  title?: string;
  lead?: string;
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${tint ? "bg-surface/40" : "bg-night"} px-5 py-16 md:py-24`}
    >
      <div className="mx-auto max-w-6xl" data-aos="fade-up">
        {title && (
          <header className="mb-10 max-w-3xl md:mb-14">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {title}
            </h2>
            {lead && (
              <p className="mt-4 text-base leading-relaxed text-mute md:text-lg">
                {lead}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page data                                                           */
/* ------------------------------------------------------------------ */

const quickLinks = [
  {
    href: "https://combo.tripsit.me/",
    external: true,
    icon: <JoinInnerOutlinedIcon fontSize="inherit" />,
    title: "Compare drug combos",
    text: "Explore our interactive chart detailing the effects of combining popular drugs for informed decisions.",
  },
  {
    href: "/factsheets",
    external: false,
    icon: <FactCheckOutlinedIcon fontSize="inherit" />,
    title: "Get drug info",
    text: "Dive deep into our detailed factsheets for comprehensive insights on drug dosages, durations, and more.",
  },
  {
    href: "https://discord.gg/tripsit",
    external: true,
    icon: <ForumOutlinedIcon fontSize="inherit" />,
    title: "Join the Discord",
    text: "Be part of our vibrant community! Dive into our Discord, the hub where all the magic happens and plans come to life.",
  },
  {
    href: "https://learn.tripsit.me",
    external: true,
    icon: <SchoolOutlinedIcon fontSize="inherit" />,
    title: "Take a course",
    text: "Unlock invaluable skills with our complimentary learning platform, beginning with our flagship course: 'Intro to TripSitting'.",
  },
];

const resources = [
  {
    href: "https://combo.tripsit.me/",
    icon: <JoinInnerOutlinedIcon fontSize="inherit" />,
    title: "Combo App",
    text: "Explore our innovative Combo Chart, a must-see resource for informed substance combinations. Dive in now!",
  },
  {
    href: "/factsheets",
    icon: <FactCheckOutlinedIcon fontSize="inherit" />,
    title: "Drug Factsheets",
    text: "Dive into our comprehensive Drug Factsheets for concise and essential insights on various substances.",
  },
  {
    href: "https://wiki.tripsit.me/wiki/Main_Page",
    icon: <MenuBookOutlinedIcon fontSize="inherit" />,
    title: "Substance Wiki",
    text: "Immerse yourself in our extensive Substance Wiki, brimming with detailed insights on drugs and herbal remedies. We invite you to register and contribute informed edits. Eager to collaborate? Connect with our team in the Discord #content room!",
  },
  {
    href: "https://benzos.tripsit.me/",
    icon: <TransformOutlinedIcon fontSize="inherit" />,
    title: "Benzo Converter",
    text: "Utilize our Benzo Converter for approximate conversions between different types of benzodiazepines.",
  },
  {
    href: "https://dxm.tripsit.me/",
    icon: <CalculateOutlinedIcon fontSize="inherit" />,
    title: "DXM Calculator",
    text: "Determine the optimal safe DXM dosage tailored to your body weight with our intuitive calculator.",
  },
  {
    href: "https://volume.tripsit.me/",
    icon: <ScienceOutlinedIcon fontSize="inherit" />,
    title: "Volumetric Converter",
    text: "For powders with microgram-level potency, ensuring safe dosage can be challenging. Our Volumetric Converter aids in creating a uniform solution, ensuring precise and safer dosing of these potent substances.",
  },
  {
    href: "https://learn.tripsit.me",
    icon: <SchoolOutlinedIcon fontSize="inherit" />,
    title: "Learning Platform",
    text: "Elevate your knowledge with our Learning Platform, a dedicated space for community members to undertake courses and demonstrate expertise. Embracing an open-source ethos, we invite enthusiasts to contribute by crafting their own courses.",
  },
  {
    href: "https://tripbot.info/",
    icon: <SmartToyOutlinedIcon fontSize="inherit" />,
    title: "TripSit Discord Bot",
    text: "Introducing our multifunctional Discord Bot, designed to seamlessly blend moderation capabilities with TripSit-session management. Perfect not just for TripSit, but adaptable for any Discord guild. Interested in launching your own TripSit-inspired initiative? Our tools are at your disposal.",
  },
  {
    href: "https://play.google.com/store/apps/details?id=me.tripsit.mobile",
    icon: <PhoneAndroidOutlinedIcon fontSize="inherit" />,
    title: "Android Mobile App",
    text: "Stay informed anytime, anywhere with our Android Mobile App. Enjoy offline access to comprehensive drug factsheets and essential combination data at your fingertips.",
  },
];

const friends = [
  { href: "https://maps.org/", title: "MAPS", img: mapsLogo },
  { href: "https://bluelight.org/xf/", title: "Bluelight", img: bluelightLogo },
  {
    href: "https://effectindex.com/",
    title: "Subjective Effect Index",
    img: seiLogo,
  },
  { href: "https://dancesafe.org/", title: "DanceSafe", img: dancesafeLogo },
  {
    href: "https://psychonautwiki.org/wiki/Main_Page",
    title: "PsychonautWiki",
    img: pwLogo,
  },
  { href: "https://reddit.com/r/drugs", title: "r/Drugs", img: rdrugsLogo },
];

const testimonials = [
  {
    name: "loki_queen333",
    role: "Discord Member",
    text: "I wanted to give a big kudos and air five...you know, covid haha...to everyone on the TripSit team. Even the community helpers. I've been watching for a bit and so happy even people who don't know each other make people feel safe and loved. Everyone is going through so much! This is a fun, safe, and helpful environment that I am proud to witness first hand. So thank you so much for keeping this network around when the rest of the world keeps turning to shit. People come and go but this truly feels like a network family. So awesome job everyone. If you haven't been told in awhile, well then I am so proud of you! ❤️",
  },
  {
    name: "Misted",
    role: "Discord Member",
    text: "I just want to give huge hugs to every member of the TripSit Team for being so active member here ❤️ I love you guys for being here, helping people and giving your free time to grow a positive community for everyone to share their stories and lives that are surrounded by drugs. Places like this make the world a better place when you aren't demonized by anyone, which is amazing!",
  },
  {
    name: "Squonk",
    role: "Discord Member",
    text: "I admire everyone's commitment to #TriPSiT throughout the years. And i am immensely proud and glad for the assistance\\social ground\\venting possibility~.., throughout the many many years. The educative vigor\\interests\\additions, in regards to advancement of both the www-site, Discord, and especially the IRC, in assisting and informing, is amazing. And i know a lot of people have had real life-altering\\life-saving, experiences throughout the many years. I thank you kindly, warmly, and genuinely lovingly, for being.",
  },
  {
    name: "Bloopiness",
    role: "Discord Member",
    text: "I'd just like to thank everyone that is a part of Team TripSit for all of your continued efforts to make TripSit a better and more useful service, everyday! I'm sure I speak for everyone when I say that we're all very grateful that you all exist! I hope you're all having a wonderful day!",
  },
  {
    name: "Benjamin",
    role: "Discord Member",
    text: "You're all fucking wonderful people. I can't emphasize this enough: I am glad to be friends with all of you. I haven't gotten in a single fight since being on here. There's just so much love. Thank you. I wouldn't be here without all of you.",
  },
  {
    name: "Eagle",
    role: "Discord Member",
    text: "Thank you all for being here and taking the time to help people trough different things and big love to this community. i practiced way safer use with drugs and don't have the need anymore to overdo it keep it up ❤️ 💯",
  },
];

const databaseDrugs = { startNum: 0, endNum: 780, duration: 4, delay: 1 };
const subredditSubscribers = {
  startNum: 0,
  endNum: 57468,
  duration: 4,
  delay: 1,
};

function getTsAge(): number {
  // Years since Sep 26, 2011
  const today = new Date();
  let years = today.getFullYear() - 2011;
  if (today.getMonth() + 1 <= 9 && today.getDate() < 26) {
    years -= 1;
  }
  return years;
}

/* ------------------------------------------------------------------ */
/* Server-side data                                                    */
/* ------------------------------------------------------------------ */

async function getDiscordMetrics() {
  let guild = {} as APIGuild;

  const baseUrl = "https://discord.com/api/v10";
  const guildId = "179641883222474752";

  const url = `${baseUrl}/guilds/${guildId}?with_counts=true`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
      },
    });
    guild = response.data;
  } catch (error) {
    // Metrics are decorative; the page renders fine without them
  }

  return {
    props: { guild },
  };
}

async function getSubredditMetrics() {
  let subredditMetrics = {};

  const baseUrl = "https://oauth.reddit.com";
  const subreddit = "tripsit";

  const url = `${baseUrl}/r/${subreddit}/about`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `bearer ${process.env.REDDIT_BOT_TOKEN}`,
        "User-Agent": "TripSitWebsite/0.1 by Techno_Shaman",
      },
    });
    subredditMetrics = response.data;
  } catch (error) {
    // Metrics are decorative; the page renders fine without them
  }

  return {
    props: { subredditMetrics },
  };
}

export async function getServerSideProps() {
  const [discordMetrics, subredditMetrics] = await Promise.all([
    getDiscordMetrics(),
    getSubredditMetrics(),
  ]);
  return {
    props: {
      ...discordMetrics.props,
      ...subredditMetrics.props,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home({ guild }: { guild: APIGuild }) {
  const onlineNow = guild.approximate_presence_count ?? 0;

  const stats = [
    {
      label: "Years of Service",
      data: { ...databaseDrugs, endNum: getTsAge() },
    },
    {
      label: "Discord Members",
      data: {
        startNum: 0,
        endNum: guild.approximate_member_count ?? 0,
        duration: 4,
        delay: 1,
      },
    },
    { label: "Drugs in our Database", data: databaseDrugs },
    { label: "Subreddit Subscribers", data: subredditSubscribers },
  ];

  return (
    <div
      data-bs-theme="dark"
      className={`${inter.variable} ${grotesk.variable} font-body text-ink antialiased`}
    >
      <Header />
      <Head />
      <Ghost />

      {/* Hero is transparent so the particles canvas shows through */}
      <section id="hero" className="relative px-5 pb-20 pt-28 md:pt-36">
        <div
          className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center"
          data-aos="fade-up"
        >
          <h1 className="mb-6">
            <Image
              src={logo}
              alt="TripSit"
              priority
              className="mx-auto h-auto w-60 max-w-full md:w-80"
            />
          </h1>
          <p className="font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">
            Harm Reduction Through Education
          </p>

          {onlineNow > 0 && (
            <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border-[1px] border-solid border-line bg-surface/70 px-4 py-1.5 text-sm text-mute backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span>
                <strong className="font-medium text-ink">
                  {onlineNow.toLocaleString("en-US")}
                </strong>{" "}
                people are here right now
              </span>
            </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/webchat"
              className="rounded-full bg-violet px-8 py-3.5 font-display text-base font-semibold text-night transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              I want to talk to a Trip Sitter
            </Link>
            <a
              href="https://combo.tripsit.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-[1px] border-solid border-line px-8 py-3.5 font-display text-base text-ink transition hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Check drug combinations
            </a>
          </div>

          <div className="mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((card) => {
              const inner = (
                <>
                  <span className="mb-4 inline-flex text-3xl text-cyan">
                    {card.icon}
                  </span>
                  <h2 className="mb-2 font-display text-lg font-semibold text-ink">
                    {card.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-mute">
                    {card.text}
                  </p>
                </>
              );
              const cardClass =
                "group flex h-full flex-col rounded-2xl border-[1px] border-solid border-line bg-surface/80 p-6 text-ink backdrop-blur transition hover:-translate-y-0.5 hover:border-violet/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan motion-reduce:hover:translate-y-0";
              return card.external ? (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={card.title} href={card.href} className={cardClass}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <Particles />

      <main id="main" className="relative">
        {/* Stats */}
        <section id="counts" className="border-y border-line/60 bg-night px-5">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 py-12 md:py-16 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="count-box text-center">
                <span className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl [&_div]:inline">
                  <Counter data={stat.data} />
                </span>
                <p className="mt-2 text-xs uppercase tracking-widest text-mute md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <Section
          id="about"
          title="About Us"
          lead="In an era where assistance often doesn't measure up, TripSit emerges as the beacon of hope. We're driving forward with a mission to dismantle misconceptions about drug use and arm individuals with the tools they need for safer experiences."
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-ink">
                Our foundational principles are clear-cut:
              </p>
              <ul className="space-y-4">
                {[
                  "Accept that people will use substances, regardless of legality or social stigma.",
                  "Know it is possible to use substances while reducing harmful practices.",
                  "Conviction that informed education is the cornerstone for harm mitigation.",
                ].map((principle) => (
                  <li key={principle} className="flex gap-3 text-mute">
                    <i
                      className="ri-check-double-line mt-0.5 text-xl leading-none text-violet"
                      aria-hidden
                    />
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 text-mute">
              <p>
                At TripSit, our emphasis lies in fostering open conversations
                and enacting harm reduction methodologies. Beyond championing
                essentials like test kits, we provide a roadmap for more prudent
                drug interactions. We&apos;ve cultivated a platform that
                promotes discourse from scientific, medical, and philosophical
                angles on drugs, offering counsel rooted in our shared journeys.
              </p>
              <p className="rounded-xl border-[1px] border-solid border-amber/40 bg-amber/10 p-4 text-sm leading-relaxed text-ink">
                We&apos;re a passionate group of volunteers, not certified
                professionals. Our suite of services is designed to assist
                those seeking information, an unbiased ear, testing resources,
                or just a welcoming space.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Accordion>
              <AccordionItem
                key="0"
                aria-label="Learn More"
                title="Learn More"
                classNames={accordionItemClassNames}
              >
                <p>
                  In an era where assistance often doesn&apos;t measure up,
                  TripSit stands as a beacon of hope. We&apos;re passionately
                  driven to challenge drug-related stigmas and empower
                  individuals with the tools they need for safer experiences.
                </p>
                <p>
                  At the heart of TripSit is our commitment to open dialogue and
                  the practical application of harm reduction strategies. Beyond
                  championing tools like test kits, we provide a roadmap for
                  informed and safer drug interactions. Our platform is a hub
                  for discourse on drugs from scientific, medical, and
                  philosophical viewpoints, offering insights rooted in our
                  collective journeys.
                </p>
                <p>
                  With the understanding that people will engage with substances
                  irrespective of their legal status, our goal is to minimize
                  the dangers of uninformed consumption. Our umbrella of support
                  ranges from offering a listening ear and guidance on dosage to
                  suggesting avenues for recovery.
                </p>
                <p>
                  Our vibrant community features a 24/7 live chat for
                  on-the-spot help and a drug-knowledge wiki for swift facts.
                  Additionally, our live radio service offers musical
                  companionship to resonate with our users.
                </p>
                <p>
                  We&apos;re a passionate group of volunteers, not certified
                  professionals. Our suite of services is designed to assist
                  those seeking information, an unbiased ear, testing resources,
                  or just a welcoming space.
                </p>
                <p>
                  TripSit doesn&apos;t endorse drug consumption. Rather, our
                  network serves individuals who&apos;ve chosen to use
                  substances, emphasizing their well-being. We ardently advise
                  against risky drug mixtures and maintain a strict policy
                  against discussions of self-harm or suicide.
                </p>
                <p>
                  While we don&apos;t replace the expertise of medical
                  professionals, our mission is to offer guidance and a positive
                  anchor to those already exploring substances. We educate about
                  potential adverse effects, addiction dangers, and risky drug
                  combinations.
                </p>
                <p>
                  We&apos;re a sanctuary for those wary of seeking guidance due
                  to societal prejudices. By offering advice, unwavering
                  support, and positivity, and by confronting outdated views on
                  substance use, TripSit endeavors to deliver potentially
                  life-saving knowledge and tools.
                </p>
                <p>
                  A heartfelt message from the TripSit family: Prioritize safety
                  and knowledge.
                </p>
                <p>
                  From all of us at TripSit: Stay safe and dose responsibly.
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>

        {/* Combo chart */}
        <Section id="about-video" tint>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <a
              href="https://combo.tripsit.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl border-[1px] border-solid border-line transition hover:border-violet/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              data-aos="fade-right"
            >
              <Image
                src={comboChart}
                alt="The TripSit drug combination chart"
                className="h-auto w-full"
              />
            </a>
            <div data-aos="fade-left">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                Our Combo Chart is a cornerstone of the HR scene.
              </h2>
              <p className="mt-4 italic text-mute">
                We give permissions to print and distribute our chart for
                non-profit usage. <br />
                Full details of usage rights are in our FAQ below, but it
                boils down to:
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Do not make a profit off our work. We don't do this for profit and neither should you.",
                  "Keep our logo on the chart. We don't ask for money, but we deserve the recognition.",
                  "Do not change the data. We worked hard on this and can't verify adjustments.",
                ].map((rule) => (
                  <li key={rule} className="flex gap-3 text-mute">
                    <i
                      className="bx bx-check-double mt-0.5 text-xl leading-none text-violet"
                      aria-hidden
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-mute">
                Otherwise, we give permission to print out and distribute this
                chart to whoever wants to. Make your own posters, print it on a
                t-shirt, or even make a giant banner and display it as a
                festival! We just want the information out there where it can
                help people.
              </p>
            </div>
          </div>
        </Section>

        {/* Friends */}
        <section id="clients" className="bg-night px-5 py-14">
          <div className="mx-auto max-w-6xl" data-aos="fade-up">
            <p className="mb-8 text-center text-sm uppercase tracking-widest text-mute">
              TripSit is friends with...
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {friends.map((friend) => (
                <a
                  key={friend.title}
                  href={friend.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  <Tooltip title={friend.title} placement="bottom">
                    <Image
                      src={friend.img}
                      alt={friend.title}
                      className="h-10 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-12"
                    />
                  </Tooltip>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Section
          id="testimonials"
          title="Testimonials"
          lead="We are so proud of our volunteer force and the work they do! The amount of empathy, compassion and knowledge they bring to the table is astounding. We are so lucky to have them!"
          tint
        >
          <Swiper
            className="testimonials-swiper !pb-12"
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
          >
            {testimonials.map((quote) => (
              <SwiperSlide key={quote.name} className="!h-auto">
                <figure className="flex h-full flex-col rounded-2xl border-[1px] border-solid border-line bg-surface p-6">
                  <blockquote className="flex-1 text-sm leading-relaxed text-mute">
                    <span
                      aria-hidden
                      className="mb-2 block font-display text-4xl leading-none text-violet/60"
                    >
                      &ldquo;
                    </span>
                    {quote.text}
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="font-display font-semibold text-ink">
                      {quote.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-mute">
                      {quote.role}
                    </p>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </Section>

        {/* Resources */}
        <Section
          id="resources"
          title="Resources"
          lead="TripSit offers various resources, all free of charge, and maintained by the community."
        >
          <div className="grid gap-[1.25rem] sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((tool) => {
              const inner = (
                <>
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet/15 text-2xl text-violet transition group-hover:bg-violet group-hover:text-night">
                    {tool.icon}
                  </span>
                  <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                    {tool.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mute">
                    {tool.text}
                  </p>
                </>
              );
              const cardClass =
                "group flex h-full flex-col rounded-2xl border-[1px] border-solid border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-violet/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan motion-reduce:hover:translate-y-0";
              return tool.href.startsWith("/") ? (
                <Link key={tool.title} href={tool.href} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <a
                  key={tool.title}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </Section>

        {/* Get involved */}
        <Section
          id="cta"
          title="Join Our Mission"
          lead="At TripSit, we're a close-knit, volunteer-driven community. Whether you bring technical prowess, a knack for research, or simply a friendly spirit to chat in the lounge, there's a place for you here. Our ongoing development projects always welcome an extra pair of hands, and our drug databases eagerly await updates with the latest substances. Every piece of information benefits from meticulous review and proofreading. No contribution is too small, and every effort is deeply valued!"
          tint
        >
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Join the community"
              startContent={accStart("👥")}
              title="Join the community"
              classNames={accordionItemClassNames}
            >
              <p>
                Dive into our vibrant community, brimming with positive and
                like-minded individuals. Beyond our shared passions, we
                celebrate diverse interests, from gaming in our{" "}
                <a href="https://steamcommunity.com/groups/TripSit">
                  Steam community
                </a>{" "}
                to showcasing our beloved pets, culinary adventures, and
                artistic endeavors. The heart and soul of our existence? Our
                phenomenal community! Take the leap,{" "}
                <a href="https://discord.gg/tripsit">join our Discord</a>,
                introduce yourself, and immerse in the camaraderie. It&apos;s an
                experience you&apos;ll cherish!
              </p>
              <p>
                Our Discord also serves as the hub for project collaborations
                and open-source development endeavors. Whether you&apos;re keen
                to contribute or simply observe the evolution, Discord is your
                go-to platform!
              </p>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Become a Helper"
              startContent={accStart("🤝")}
              title="Become a Helper"
              classNames={accordionItemClassNames}
            >
              <p>
                Do you share our passion for assisting others? You might be the
                perfect fit for our team. We&apos;re always on the lookout for
                enthusiastic additions to the TripSit Team. Begin your journey
                with the &quot;Intro to TripSitting&quot; course on our learning
                platform. This complimentary course equips you with the
                foundational skills to excel as a TripSitter and integrates your
                Discord account with your course progress.
              </p>
              <p>
                Upon course completion, you&apos;ll have the opportunity to join
                us as a Helper, actively participating in TripSit sessions.
                Display consistent dedication and contribution, and we&apos;ll
                be thrilled to welcome you as a full-fledged TripSitter!
              </p>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Help with Research"
              startContent={accStart("🔍")}
              title="Help with Research"
              classNames={accordionItemClassNames}
            >
              <p>
                Interested in collaborating on our research projects? We&apos;d
                love to have you on board. Start by{" "}
                <a href="https://discord.gg/tripsit">joining our Discord</a> and
                heading over to the #content room where all the brainstorming
                and discussions take place.
              </p>
              <p>
                The realm of substances is continually expanding, and
                there&apos;s a constant need to refresh and augment our wiki. If
                you have expertise or insights,{" "}
                <a href="https://wiki.tripsit.me/index.php?title=Special:CreateAccount">
                  registration is open
                </a>{" "}
                for contributions. All updates and new entries are channeled
                through our Discord for collaborative review and refinement.
              </p>
              <p>
                Our learning platform is at the forefront of disseminating harm
                reduction knowledge. If you have ideas or content for new
                courses, we&apos;re all ears. And if you have a flair for data
                and details, our drug factsheet database beckons. Dive deeper
                into the Development section for a clearer picture of how you
                can play a part.
              </p>
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="Assist with Development"
              startContent={accStart("💻")}
              title="Assist with Development"
              classNames={accordionItemClassNames}
            >
              <h3>Services</h3>
              <p>
                All of our development is public on GitHub, and everything is
                coded in Javascript:
              </p>
              <ul>
                <li>
                  <a href="https://github.com/TripSit/TripBot/tree/main/src/api">
                    API
                  </a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/Benzo-Calculator">
                    Benzo Converter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/combogen">Comboapp</a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/DXM-Calculator/">
                    DXM Calculator
                  </a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/drugs/">Factsheets</a>
                </li>
                <li>
                  <a href="https://volume.tripsit.me/">Volumetric Converter</a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/webchat/">Webchat</a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/TripBot">TripBot</a>
                </li>
                <li>
                  <a href="https://github.com/TripSit/tripbot-website">
                    Tripbot&apos;s Website
                  </a>
                </li>
              </ul>
              <p>
                These projects have been converted to docker containers, but
                more work is needed to add some standard functionality to each
                container to make each project more uniform. Tasks include:
              </p>
              <ul>
                <li>Add Sonar linting.</li>
                <li>Add Sentry error monitoring.</li>
                <li>Add Google Analytics.</li>
                <li>Add Donation buttons (Patreon/Kofi).</li>
                <li>Add Github actions (CodeQL).</li>
                <li>Add CI (Drone).</li>
                <li>Convert to Typescript.</li>
                <li>Convert to GitHub pages (when possible).</li>
                <li>Integrate into new website</li>
              </ul>
              <p>
                Keep in mind that TripSit has a rich history spanning over a
                decade, built on legacy systems and a mosaic of documentation
                and code. Navigating and contributing might present its
                challenges initially. However, with perseverance, a willingness
                to learn, and a dash of patience, you&apos;ll find that no task
                is insurmountable.
              </p>
              <p>
                <b>We&apos;re also open to new project ideas!</b>
              </p>
              <h3>Android App</h3>
              <p>
                Our Android app is functional, but we believe there&apos;s room
                for enhancement. If you have the skills and vision to elevate
                its performance and design, we&apos;d love to see your touch.
                Dive into the codebase and contribute:{" "}
                <a href="https://github.com/TripSit/tripsit-mobile">
                  https://github.com/TripSit/tripsit-mobile
                </a>
                .
              </p>
              <h3>Main Website</h3>
              <p>
                Our main website, built on NextJS, is envisioned as a unified
                platform, seamlessly integrating our diverse services. We
                welcome contributions of all sizes to enhance its functionality
                and user experience. Dive in and make a difference:{" "}
                <a href="https://github.com/TripSit/website">
                  https://github.com/TripSit/website
                </a>
                .
              </p>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* FAQ */}
        <Section
          id="faq"
          title="Frequently Asked Questions"
          lead="Answers to our most commonly asked questions. Is your question not here? Contact us using a method below!"
        >
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Can I print the combo chart?"
              startContent={accStart("?")}
              title="Can I print the combo chart?"
              classNames={accordionItemClassNames}
            >
              <p>
                TripSit hereby grants you a non-exclusive, non-transferable
                license to use, reproduce, distribute, and display images and
                content from TripSit, in accordance with the following
                conditions:
              </p>
              <p>
                <b>Non-commercial Use Only:</b> You are permitted to use our
                images and content for purposes other than commercial
                exploitation. This entails that you may print, distribute, or
                display the images and content, but you are prohibited from
                selling them or using them in any manner from which you might
                derive direct or indirect monetary benefit.
              </p>
              <p>
                <b>Attribution:</b> Any reproduction or distribution of our
                images or content must attribute credit to TripSit. This can be
                done by placing our{" "}
                <a href="https://drive.google.com/file/d/16529Ykfx1E-BD7kfFn02HAqo1aMCwCwj/view?usp=drive_link">
                  logo with URL
                </a>{" "}
                in proximity to the image or content.
              </p>
              <p>
                <b>No Derivative Works:</b> You are free to use our images and
                content in their original form. However, you are restricted from
                modifying, altering, or creating derivative versions unless you
                obtain express written consent from TripSit.
              </p>
              <p>
                <b>No Warranty:</b> Our images and content are provided &quot;as
                is&quot; without any form of warranty. TripSit shall not bear
                any liability for losses, damages, or claims stemming from your
                utilization of the images and content.
              </p>
              <p>
                <b>Termination:</b> Breaching any term of this agreement will
                result in the immediate revocation of your license to use our
                images and content. Furthermore, TripSit retains the right to
                terminate this license at its discretion and at any time. This
                clause is a standard legal provision, and we do not anticipate
                enacting it arbitrarily.
              </p>
              <p>
                <b>Reservation of Rights:</b> All rights not explicitly
                conferred by this agreement remain the property of TripSit. We
                also reserve the right to amend the conditions of this license
                as circumstances dictate.
              </p>
              <p>
                By leveraging our images and content, you are confirming your
                acceptance of and compliance with the terms delineated above. We
                earnestly hope our materials prove beneficial for your
                non-commercial ventures.
              </p>
              <p>
                For inquiries or if you wish to seek permissions beyond the
                scope of this license, please reach out through one of our
                contact methods below.
              </p>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="What happened to the IRC?"
              startContent={accStart("?")}
              title="What happened to the IRC?"
              classNames={accordionItemClassNames}
            >
              <p>
                Over a decade, we faced numerous challenges with IRC that
                remained unresolved. Given our resource constraints, ensuring a
                high-quality chat experience on IRC became untenable.
              </p>
              <p>
                Turning to Discord, we found the security and user-friendly
                features that we had longed for with IRC. Furthermore, our
                Discord bot has already made significant positive impacts in the
                harm reduction communities of Bluelight and r/Drugs.
              </p>
              <p>
                While the IRC remains accessible, its use is limited to those
                with pre-existing accounts. We may consider new account creation
                on a selective basis, but we currently have no intentions of
                reopening the IRC to the general public. Importantly, the IRC is
                fully integrated with Discord, ensuring that no conversation is
                missed. Additionally, we&apos;re in the process of setting up a
                Matrix server, which aims to address any privacy concerns
                associated with Discord and our reservations about relying on
                older software platforms.
              </p>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Can I interview TripSit?"
              startContent={accStart("?")}
              title="Can I interview TripSit?"
              classNames={accordionItemClassNames}
            >
              <p>
                TripSit operates as a volunteer-driven organization, and many of
                our members are engaged in full-time commitments. While our
                availability for formal interviews might be limited, we&apos;re
                always open to addressing questions and engaging in discussions.
                The most effective way to reach out to our team is via our
                Discord.
              </p>
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="I sent an email and you didn't respond, what gives?"
              startContent={accStart("?")}
              title="I sent an email and you didn't respond, what gives?"
              classNames={accordionItemClassNames}
            >
              <p>
                We apologize for the oversight. As a tight-knit volunteer team,
                we occasionally struggle to keep up with the influx of emails.
                We&apos;re striving to improve our response time. For a quicker
                response or more direct engagement, reaching out to us on
                Discord is highly recommended.
              </p>
            </AccordionItem>
          </Accordion>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
