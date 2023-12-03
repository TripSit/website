/* eslint-disable arrow-parens */
import Image from "next/image";
import React from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Tooltip, Accordion, AccordionItem, Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import JoinInnerOutlinedIcon from "@mui/icons-material/JoinInnerOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import axios from "axios";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
// import queryString from "@/utils/queryString";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import DiscordMembers from "../components/DiscordMembers";
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
// import Appeal from "../components/Appeal";
import Counter from "../components/Counter";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const aboutUsAccordionClassNames = {
  base: "aboutAccBase",
  heading: "aboutAccHeading",
  trigger: "aboutAccTrigger",
  titleWrapper: "aboutAccWrapper",
  title: "aboutAccTitle",
  subtitle: "aboutAccSubtitle",
  startContent: "aboutAccContent",
  indicator: "aboutAccIndicator",
  content: "aboutAccContent",
};

const accordionClassNames = {
  base: "accBase",
  heading: "accHeading",
  trigger: "accTrigger",
  titleWrapper: "accWrapper",
  title: "accTitle",
  subtitle: "accSubtitle",
  startContent: "accContent",
  indicator: "accIndicator",
  content: "accContent",
};

const databaseDrugs = {
  startNum: 0,
  endNum: 780,
  duration: 4,
  delay: 1,
};

const subredditSubscribers = {
  startNum: 0,
  endNum: 57468,
  duration: 4,
  delay: 1,
};

function getTsAge(): number {
  // This function calculates how many years it has been since Sep 26, 2011
  const today = new Date();
  let years = today.getFullYear() - 2011;
  if (today.getMonth() + 1 <= 9 && today.getDate() < 26) {
    // Months start at 0
    years -= 1;
  }
  return years;
}

async function getDiscordMetrics() {
  let guildMetrics = {};

  const baseUrl = "https://discord.com/api/v10";
  const guildId = "179641883222474752";

  const url = `${baseUrl}/guilds/${guildId}?with_counts=true`;
  // console.log("Fetching metrics from:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
      },
    });
    guildMetrics = response.data;
    // console.log("Discord metrics:", guildMetrics);
  } catch (error) {
    // console.error("Error fetching guild metrics:", error);
  }

  return {
    props: { guildMetrics },
  };
}

// function getOauthURL() {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   // const [stateParam, setStateParam] = useState("");
//   // const [oAuthUrl, setOAuthUrl] = useState("");
//   console.log(
//     `GetOauthURL - DISCORD_CLIENT_ID: ${process.env.DISCORD_CLIENT_ID}`,
//   );

//   const loginParams = {
//     client_id: process.env.DISCORD_CLIENT_ID as string,
//     redirect_uri: `https://${process.env.DNS_DOMAIN}/#appeal`,
//     response_type: "token",
//     scope: "identify",
//     state: stateParam as string,
//   };
//   setOAuthUrl(
//     `https://discord.com/api/oauth2/authorize${queryString(loginParams)}`,
//   );

//   return {
//     props: { oAuthUrl },
//   };
// }

async function getSubredditMetrics() {
  let subredditMetrics = {};

  const baseUrl = "https://oauth.reddit.com";
  const subreddit = "tripsit";

  const url = `${baseUrl}/r/${subreddit}/about`;
  // console.log("Fetching metrics from:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `bearer ${process.env.REDDIT_BOT_TOKEN}`,
        "User-Agent": "TripSitWebsite/0.1 by Techno_Shaman",
      },
    });
    subredditMetrics = response.data;
    // console.log("subredditMetrics:", subredditMetrics);
  } catch (error) {
    // console.error("Error fetching subredditMetrics:");
    // console.error((error as any).code);
    // console.error((error as any).response.status);
    // console.error((error as any).response.statusText);
    // console.error(process.env.REDDIT_BOT_TOKEN);
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

export default function Home({ guildMetrics }: any) {
  const router = useRouter();

  const gotoWebchat = () => {
    router.push("/webchat");
  };

  const gotoFactsheets = () => {
    router.push("/factsheets");
  };

  return (
    <div data-bs-theme="dark">
      <Header />
      <Head />
      <Ghost />
      <section id="hero" className="d-flex align-items-center">
        <div
          className="container position-relative"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9 text-center">
              <h1>
                <Image src={logo} alt="" className="logo img-fluid" />
              </h1>
              <h2>Harm Reduction Through Education</h2>
            </div>
          </div>
          <div className="text-center">
            <Button
              color="primary"
              className="btn-get-started scrollto"
              onClick={gotoWebchat}
            >
              I want to talk to a Trip Sitter
            </Button>
          </div>
          <div className="row icon-boxes">
            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <a
                href="https://combo.tripsit.me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon-box">
                  <div className="icon">
                    <JoinInnerOutlinedIcon />
                  </div>
                  <h4 className="title">Compare drug combos</h4>
                  <p className="description">
                    Explore our interactive chart detailing the effects of
                    combining popular drugs for informed decisions.
                  </p>
                </div>
              </a>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div
                style={{ cursor: "pointer" }}
                className="icon-box"
                onClick={gotoFactsheets}
              >
                <div className="icon">
                  <FactCheckOutlinedIcon />
                </div>
                <h4 className="title">Get drug info</h4>
                <p className="description">
                  Dive deep into our detailed factsheets for comprehensive
                  insights on drug dosages, durations, and more.
                </p>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <a
                href="https://discord.gg/tripsit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon-box">
                  <div className="icon">
                    <i className="bx bxl-discord"></i>
                  </div>
                  <h4 className="title">Join the Discord</h4>
                  <p className="description">
                    Be part of our vibrant community! Dive into our Discord, the
                    hub where all the magic happens and plans come to life.
                  </p>
                </div>
              </a>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              <a
                href="https://learn.tripsit.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon-box">
                  <div className="icon">
                    <SchoolOutlinedIcon />
                  </div>
                  <h4 className="title">Take a course</h4>
                  <p className="description">
                    Unlock invaluable skills with our complimentary learning
                    platform, beginning with our flagship course: &apos;Intro to
                    TripSitting&apos;.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Particles />
      <main id="main">
        <section id="about" className="about">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>About Us</h2>
              <p>
                In an era where assistance often doesn&apos;t measure up,
                TripSit emerges as the beacon of hope. We&apos;re driving
                forward with a mission to dismantle misconceptions about drug
                use and arm individuals with the tools they need for safer
                experiences.{" "}
              </p>
            </div>

            <div className="row content">
              <div className="col-lg-6">
                <p>Our foundational principles are clear-cut:</p>
                <ul>
                  <li>
                    <i className="ri-check-double-line"></i> Accept that people
                    will use substances, regardless of legality or social
                    stigma.
                  </li>
                  <li>
                    <i className="ri-check-double-line"></i> Know it is possible
                    to use substances while reducing harmful practices.
                  </li>
                  <li>
                    <i className="ri-check-double-line"></i> Conviction that
                    informed education is the cornerstone for harm mitigation.
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 pt-4 pt-lg-0">
                <p>
                  At TripSit, our emphasis lies in fostering open conversations
                  and enacting harm reduction methodologies. Beyond championing
                  essentials like test kits, we provide a roadmap for more
                  prudent drug interactions. We&apos;ve cultivated a platform
                  that promotes discourse from scientific, medical, and
                  philosophical angles on drugs, offering counsel rooted in our
                  shared journeys.
                </p>
              </div>
            </div>

            <div className="row content">
              <div className="col-lg-12">
                <Accordion>
                  <AccordionItem
                    key="0"
                    aria-label="Learn More"
                    title="Learn More"
                    classNames={aboutUsAccordionClassNames}
                  >
                    <p>
                      In an era where assistance often doesn&apos;t measure up,
                      TripSit stands as a beacon of hope. We&apos;re
                      passionately driven to challenge drug-related stigmas and
                      empower individuals with the tools they need for safer
                      experiences.
                    </p>
                    <p>
                      At the heart of TripSit is our commitment to open dialogue
                      and the practical application of harm reduction
                      strategies. Beyond championing tools like test kits, we
                      provide a roadmap for informed and safer drug
                      interactions. Our platform is a hub for discourse on drugs
                      from scientific, medical, and philosophical viewpoints,
                      offering insights rooted in our collective journeys.
                    </p>
                    <p>
                      With the understanding that people will engage with
                      substances irrespective of their legal status, our goal is
                      to minimize the dangers of uninformed consumption. Our
                      umbrella of support ranges from offering a listening ear
                      and guidance on dosage to suggesting avenues for recovery.
                    </p>
                    <p>
                      Our vibrant community features a 24/7 live chat for
                      on-the-spot help and a drug-knowledge wiki for swift
                      facts. Additionally, our live radio service offers musical
                      companionship to resonate with our users.
                    </p>
                    <p>
                      We&apos;re a passionate group of volunteers, not certified
                      professionals. Our suite of services is designed to assist
                      those seeking information, an unbiased ear, testing
                      resources, or just a welcoming space.
                    </p>
                    <p>
                      TripSit doesn&apos;t endorse drug consumption. Rather, our
                      network serves individuals who&apos;ve chosen to use
                      substances, emphasizing their well-being. We ardently
                      advise against risky drug mixtures and maintain a strict
                      policy against discussions of self-harm or suicide.
                    </p>
                    <p>
                      While we don&apos;t replace the expertise of medical
                      professionals, our mission is to offer guidance and a
                      positive anchor to those already exploring substances. We
                      educate about potential adverse effects, addiction
                      dangers, and risky drug combinations.
                    </p>
                    <p>
                      We&apos;re a sanctuary for those wary of seeking guidance
                      due to societal prejudices. By offering advice, unwavering
                      support, and positivity, and by confronting outdated views
                      on substance use, TripSit endeavors to deliver potentially
                      life-saving knowledge and tools.
                    </p>
                    <p>
                      A heartfelt message from the TripSit family: Prioritize
                      safety and knowledge.
                    </p>
                    <p>
                      From all of us at TripSit: Stay safe and dose responsibly.
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section id="counts" className="counts">
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <Counter
                      data={{
                        startNum: 0,
                        endNum: getTsAge(),
                        duration: 4,
                        delay: 1,
                      }}
                    />
                  </span>
                  <p>Years of Service</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <Counter
                      data={{
                        startNum: 0,
                        endNum: guildMetrics.approximate_member_count,
                        duration: 4,
                        delay: 1,
                      }}
                    />
                  </span>
                  <p>Discord Members</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <Counter data={databaseDrugs} />
                  </span>
                  <p>Drugs in our Database</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <Counter data={subredditSubscribers} />
                  </span>
                  <p>Subreddit Subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about-video" className="about-video">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div
                className="col-lg-6 video-box align-self-baseline"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <Image src={comboChart} className="img-fluid" alt="" />
                <a
                  href="https://combo.tripsit.me/"
                  className="mb-4"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
              </div>

              <div
                className="col-lg-6 pt-3 pt-lg-0 content"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <h3>Our Combo Chart is a cornerstone of the HR scene.</h3>
                <p className="fst-italic">
                  We give permissions to print and distribute our chart for
                  non-profit usage. <br />
                  Full details of usage rights are in our FAQ below, but it
                  boils down to:
                </p>
                <ul>
                  <li>
                    <i className="bx bx-check-double"></i> Do not make a profit
                    off our work. We don&apos;t do this for profit and neither
                    should you.
                  </li>
                  <li>
                    <i className="bx bx-check-double"></i> Keep our logo on the
                    chart. We don&apos;t ask for money, but we deserve the
                    recognition.
                  </li>
                  <li>
                    <i className="bx bx-check-double"></i> Do not change the
                    data. We worked hard on this and can&apos;t verify
                    adjustments.
                  </li>
                </ul>
                <p>
                  Otherwise, we give permission to print out and distribute this
                  chart to whoever wants to. Make your own posters, print it on
                  a t-shirt, or even make a giant banner and display it as a
                  festival! We just want the information out there where it can
                  help people.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="clients" className="clients">
          <div className="container">
            <p>
              <i>TripSit is friends with...</i>
            </p>
            <div className="row">
              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://maps.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="MAPS" placement="bottom">
                    <Image src={mapsLogo} className="logo img-fluid" alt="" />
                  </Tooltip>
                </a>
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://bluelight.org/xf/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="Bluelight" placement="bottom">
                    <Image
                      src={bluelightLogo}
                      className="logo img-fluid"
                      alt=""
                    />
                  </Tooltip>
                </a>
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://effectindex.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="Subject Effect Index" placement="bottom">
                    <Image src={seiLogo} className="logo img-fluid" alt="" />
                  </Tooltip>
                </a>
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://dancesafe.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="Dance Safe" placement="bottom">
                    <Image
                      src={dancesafeLogo}
                      className="logo img-fluid"
                      alt=""
                    />
                  </Tooltip>
                </a>
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://psychonautwiki.org/wiki/Main_Page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="Psychonaut Wiki" placement="bottom">
                    <Image src={pwLogo} className="logo img-fluid" alt="" />
                  </Tooltip>
                </a>
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <a
                  href="https://reddit.com/r/drugs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="r/Drugs" placement="bottom">
                    <Image src={rdrugsLogo} className="logo img-fluid" alt="" />
                  </Tooltip>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Testimonials</h2>
              <p>
                We are so proud of our volunteer force and the work they do! The
                amount of empathy, compassion and knowledge they bring to the
                table is astounding. We are so lucky to have them!
              </p>
            </div>

            <div
              className="testimonials-slider swiper"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>I
                      wanted to give a big kudos and air five...you know, covid
                      haha...to everyone on the TripSit team. Even the community
                      helpers. I&apos;ve been watching for a bit and so happy
                      even people who don&apos;t know each other make people
                      feel safe and loved. Everyone is going through so much!
                      This is a fun, safe, and helpful environment that I am
                      proud to witness first hand. So thank you so much for
                      keeping this network around when the rest of the world
                      keeps turning to shit. People come and go but this truly
                      feels like a network family. So awesome job everyone. If
                      you haven&apos;t been told in awhile, well then I am so
                      proud of you! ❤️
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>loki_queen333</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>I
                      just want to give huge hugs to every member of the TripSit
                      Team for being so active member here ❤️ I love you guys
                      for being here, helping people and giving your free time
                      to grow a positive community for everyone to share their
                      stories and lives that are surrounded by drugs. Places
                      like this make the world a better place when you
                      aren&apos;t demonized by anyone, which is amazing!
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>Misted</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>I
                      admire everyone&apos;s commitment to #TriPSiT throughout
                      the years. And i am immensely proud and glad for the
                      assistance\social ground\venting possibility~..,
                      throughout the many many years. The educative
                      vigor\interests\additions, in regards to advancement of
                      both the www-site, Discord, and especially the IRC, in
                      assisting and informing, is amazing. And i know a lot of
                      people have had real life-altering\life-saving,
                      experiences throughout the many years. I thank you kindly,
                      warmly, and genuinely lovingly, for being. Having this use
                      of a truly humane service, is fabulous and joyfully
                      positive in regards to aiding humans on this spinball of a
                      planet
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>Squonk</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                      I&apos;d just like to thank everyone that is a part of
                      Team TripSit for all of your continued efforts to make
                      TripSit a better and more useful service, everyday!
                      I&apos;m sure I speak for everyone when I say that
                      we&apos;re all very grateful that you all exist! I hope
                      you&apos;re all having a wonderful day!
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>Bloopiness</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                      You’re all fucking wonderful people. I can’t emphasize
                      this enough: I am glad to be friends with all of you. I
                      haven’t gotten in a single fight since being on here.
                      There’s just so much love. Thank you. I wouldn’t be here
                      without all of you.
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>Benjamin</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>
                      Thank you all for being here and taking the time to help
                      people trough different things and big love to this
                      community. i practiced way safer use with drugs and
                      don&apos;t have the need anymore to overdo it keep it up
                      ❤️ 💯
                      <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <h3>Eagle</h3>
                    <h4>Discord Member</h4>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </section>

        <section id="resources" className="resources">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Resources</h2>
              <p>
                TripSit offers various resources, all free of charge, and
                maintained by the community.
              </p>
            </div>

            <div className="row">
              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <a href="https://combo.tripsit.me/">
                  <div className="icon-box iconbox-blue">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"
                        ></path>
                      </svg>
                      <i>
                        <JoinInnerOutlinedIcon id="ComboIcon" />
                      </i>
                    </div>
                    <h4>Combo App</h4>
                    <p>
                      Explore our innovative Combo Chart, a must-see resource
                      for informed substance combinations. Dive in now!
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <div
                  className="icon-box iconbox-orange "
                  onClick={gotoFactsheets}
                  style={{ cursor: "pointer" }}
                >
                  <div className="icon">
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 600 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke="none"
                        strokeWidth="0"
                        fill="#f5f5f5"
                        d="M300,582.0697525312426C382.5290701553225,586.8405444964366,449.9789794690241,525.3245884688669,502.5850820975895,461.55621195738473C556.606425686781,396.0723002908107,615.8543463187945,314.28637112970534,586.6730223649479,234.56875336149918C558.9533121215079,158.8439757836574,454.9685369536778,164.00468322053177,381.49747125262974,130.76875717737553C312.15926192815925,99.40240125094834,248.97055460311594,18.661163978235184,179.8680185752513,50.54337015887873C110.5421016452524,82.52863877960104,119.82277516462835,180.83849132639028,109.12597500060166,256.43424936330496C100.08760227029461,320.3096726198365,92.17705696193138,384.0621239912766,124.79988738764834,439.7174275375508C164.83382741302287,508.01625554203684,220.96474134820875,577.5009287672846,300,582.0697525312426"
                      ></path>
                    </svg>
                    <i>
                      <FactCheckOutlinedIcon />
                    </i>
                  </div>
                  <h4>Drug Factsheets</h4>
                  <p>
                    Dive into our comprehensive Drug Factsheets for concise and
                    essential insights on various substances.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <a href="https://wiki.tripsit.me/wiki/Main_Page">
                  <div className="icon-box iconbox-pink">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,541.5067337569781C382.14930387511276,545.0595476570109,479.8736841581634,548.3450877840088,526.4010558755058,480.5488172755941C571.5218469581645,414.80211281144784,517.5187510058486,332.0715597781072,496.52539010469104,255.14436215662573C477.37192572678356,184.95920475031193,473.57363656557914,105.61284051026155,413.0603344069578,65.22779650032875C343.27470386102294,18.654635553484475,251.2091493199835,5.337323636656869,175.0934190732945,40.62881213300186C97.87086631185822,76.43348514350839,51.98124368387456,156.15599469081315,36.44837278890362,239.84606092416172C21.716077023791087,319.22268207091537,43.775223500013084,401.1760424656574,96.891909868211,461.97329694683043C147.22146801428983,519.5804099606455,223.5754009179313,538.201503339737,300,541.5067337569781"
                        ></path>
                      </svg>
                      <i className="bx bxl-wikipedia"></i>
                    </div>
                    <h4>Substance Wiki</h4>
                    <p>
                      Immerse yourself in our extensive Substance Wiki, brimming
                      with detailed insights on drugs and herbal remedies. We
                      invite you to register and contribute informed edits.
                      Eager to collaborate? Connect with our team in the Discord
                      #content room!
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <a href="https://benzos.tripsit.me/">
                  <div className="icon-box iconbox-yellow">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,503.46388370962813C374.79870501325706,506.71871716319447,464.8034551963731,527.1746412648533,510.4981551193396,467.86667711651364C555.9287308511215,408.9015244558933,512.6030010748507,327.5744911775523,490.211057578863,256.5855673507754C471.097692560561,195.9906835881958,447.69079081568157,138.11976852964426,395.19560036434837,102.3242989838813C329.3053358748298,57.3949838291264,248.02791733380457,8.279543830951368,175.87071277845988,42.242879143198664C103.41431057327972,76.34704239035025,93.79494320519305,170.9812938413882,81.28167332365135,250.07896920659033C70.17666984294237,320.27484674793965,64.84698225790005,396.69656628748305,111.28512138212992,450.4950937839243C156.20124167950087,502.5303643271138,231.32542653798444,500.4755392045468,300,503.46388370962813"
                        ></path>
                      </svg>
                      <i>
                        <TransformOutlinedIcon />
                      </i>
                    </div>
                    <h4>Benzo Converter</h4>
                    <p>
                      Utilize our Benzo Converter for approximate conversions
                      between different types of benzodiazepines.
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <a href="https://dxm.tripsit.me/">
                  <div className="icon-box iconbox-red">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,532.3542879108572C369.38199826031484,532.3153073249985,429.10787420159085,491.63046689027357,474.5244479745417,439.17860296908856C522.8885846962883,383.3225815378663,569.1668002868075,314.3205725914397,550.7432151929288,242.7694973846089C532.6665558377875,172.5657663291529,456.2379748765914,142.6223662098291,390.3689995646985,112.34683881706744C326.66090330228417,83.06452184765237,258.84405631176094,53.51806209861945,193.32584062364296,78.48882559362697C121.61183558270385,105.82097193414197,62.805066853699245,167.19869350419734,48.57481801355237,242.6138429142374C34.843463184063346,315.3850353017275,76.69343916112496,383.4422959591041,125.22947124332185,439.3748458443577C170.7312796277747,491.8107796887764,230.57421082200815,532.3932930995766,300,532.3542879108572"
                        ></path>
                      </svg>
                      <i>
                        <CalculateOutlinedIcon />
                      </i>
                    </div>
                    <h4>DXM Calculator</h4>
                    <p>
                      Determine the optimal safe DXM dosage tailored to your
                      body weight with our intuitive calculator.
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <a href="https://volume.tripsit.me/">
                  <div className="icon-box iconbox-teal">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,566.797414625762C385.7384707136149,576.1784315230908,478.7894351017131,552.8928747891023,531.9192734346935,484.94944893311C584.6109503024035,417.5663521118492,582.489472248146,322.67544863468447,553.9536738515405,242.03673114598146C529.1557734026468,171.96086150256528,465.24506316201064,127.66468636344209,395.9583748389544,100.7403814666027C334.2173773831606,76.7482773500951,269.4350130405921,84.62216499799875,207.1952322260088,107.2889140133804C132.92018162631612,134.33871894543012,41.79353780512637,160.00259165414826,22.644507872594943,236.69541883565114C3.319112789854554,314.0945973066697,72.72355303640163,379.243833228382,124.04198916343866,440.3218312028393C172.9286146004772,498.5055451809895,224.45579914871206,558.5317968840102,300,566.797414625762"
                        ></path>
                      </svg>
                      <i>
                        <ScienceOutlinedIcon />
                      </i>
                    </div>
                    <h4>Volumetric Converter</h4>
                    <p>
                      For powders with microgram-level potency, ensuring safe
                      dosage can be challenging. Our Volumetric Converter aids
                      in creating a uniform solution, ensuring precise and safer
                      dosing of these potent substances.
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <a href="https://learn.tripsit.me">
                  <div className="icon-box iconbox-yellow">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,503.46388370962813C374.79870501325706,506.71871716319447,464.8034551963731,527.1746412648533,510.4981551193396,467.86667711651364C555.9287308511215,408.9015244558933,512.6030010748507,327.5744911775523,490.211057578863,256.5855673507754C471.097692560561,195.9906835881958,447.69079081568157,138.11976852964426,395.19560036434837,102.3242989838813C329.3053358748298,57.3949838291264,248.02791733380457,8.279543830951368,175.87071277845988,42.242879143198664C103.41431057327972,76.34704239035025,93.79494320519305,170.9812938413882,81.28167332365135,250.07896920659033C70.17666984294237,320.27484674793965,64.84698225790005,396.69656628748305,111.28512138212992,450.4950937839243C156.20124167950087,502.5303643271138,231.32542653798444,500.4755392045468,300,503.46388370962813"
                        ></path>
                      </svg>
                      <i>
                        <SchoolOutlinedIcon />
                      </i>
                    </div>
                    <h4>Learning Platform</h4>
                    <p>
                      Elevate your knowledge with our Learning Platform, a
                      dedicated space for community members to undertake courses
                      and demonstrate expertise. Embracing an open-source ethos,
                      we invite enthusiasts to contribute by crafting their own
                      courses.
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <a href="https://tripbot.info/">
                  <div className="icon-box iconbox-red">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,532.3542879108572C369.38199826031484,532.3153073249985,429.10787420159085,491.63046689027357,474.5244479745417,439.17860296908856C522.8885846962883,383.3225815378663,569.1668002868075,314.3205725914397,550.7432151929288,242.7694973846089C532.6665558377875,172.5657663291529,456.2379748765914,142.6223662098291,390.3689995646985,112.34683881706744C326.66090330228417,83.06452184765237,258.84405631176094,53.51806209861945,193.32584062364296,78.48882559362697C121.61183558270385,105.82097193414197,62.805066853699245,167.19869350419734,48.57481801355237,242.6138429142374C34.843463184063346,315.3850353017275,76.69343916112496,383.4422959591041,125.22947124332185,439.3748458443577C170.7312796277747,491.8107796887764,230.57421082200815,532.3932930995766,300,532.3542879108572"
                        ></path>
                      </svg>
                      <i>
                        <SmartToyOutlinedIcon />
                      </i>
                    </div>
                    <h4>TripSit Discord Bot</h4>
                    <p>
                      Introducing our multifunctional Discord Bot, designed to
                      seamlessly blend moderation capabilities with
                      TripSit-session management. Perfect not just for TripSit,
                      but adaptable for any Discord guild. Interested in
                      launching your own TripSit-inspired initiative? Our tools
                      are at your disposal. With an open-source development
                      approach, we continually welcome
                    </p>
                  </div>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile">
                  <div className="icon-box iconbox-teal">
                    <div className="icon">
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,566.797414625762C385.7384707136149,576.1784315230908,478.7894351017131,552.8928747891023,531.9192734346935,484.94944893311C584.6109503024035,417.5663521118492,582.489472248146,322.67544863468447,553.9536738515405,242.03673114598146C529.1557734026468,171.96086150256528,465.24506316201064,127.66468636344209,395.9583748389544,100.7403814666027C334.2173773831606,76.7482773500951,269.4350130405921,84.62216499799875,207.1952322260088,107.2889140133804C132.92018162631612,134.33871894543012,41.79353780512637,160.00259165414826,22.644507872594943,236.69541883565114C3.319112789854554,314.0945973066697,72.72355303640163,379.243833228382,124.04198916343866,440.3218312028393C172.9286146004772,498.5055451809895,224.45579914871206,558.5317968840102,300,566.797414625762"
                        ></path>
                      </svg>
                      <i>
                        <PhoneAndroidOutlinedIcon />
                      </i>
                    </div>
                    <h4>Android Mobile App</h4>
                    <p>
                      Stay informed anytime, anywhere with our Android Mobile
                      App. Enjoy offline access to comprehensive drug factsheets
                      and essential combination data at your fingertips.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="cta">
          <div className="container" data-aos="zoom-in">
            <div className="text-center">
              <h3>Join Our Mission</h3>
              <p>
                At TripSit, we&apos;re a close-knit, volunteer-driven community.
                Whether you bring technical prowess, a knack for research, or
                simply a friendly spirit to chat in the lounge, there&apos;s a
                place for you here. Our ongoing development projects always
                welcome an extra pair of hands, and our drug databases eagerly
                await updates with the latest substances. Every piece of
                information benefits from meticulous review and proofreading. No
                contribution is too small, and every effort is deeply valued!
              </p>

              <div className="cta-list">
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    startContent={<div className="accStart">👥</div>}
                    title="Join the community"
                    data-aos="fade-up"
                    classNames={accordionClassNames}
                  >
                    <p>
                      Dive into our vibrant community, brimming with positive
                      and like-minded individuals. Beyond our shared passions,
                      we celebrate diverse interests, from gaming in our
                      <a href="https://steamcommunity.com/groups/TripSit">
                        Steam community
                      </a>{" "}
                      to showcasing our beloved pets, culinary adventures, and
                      artistic endeavors. The heart and soul of our existence?
                      Our phenomenal community! Take the leap,
                      <a href="https://discord.gg/tripsit">join our Discord</a>,
                      introduce yourself, and immerse in the camaraderie.
                      It&apos;s an experience you&apos;ll cherish!
                    </p>
                    <p>
                      Our Discord also serves as the hub for project
                      collaborations and open-source development endeavors.
                      Whether you&apos;re keen to contribute or simply observe
                      the evolution, Discord is your go-to platform!
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    startContent={<div className="accStart">🤝</div>}
                    title="Become a Helper"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    classNames={accordionClassNames}
                  >
                    <p>
                      Do you share our passion for assisting others? You might
                      be the perfect fit for our team. We&apos;re always on the
                      lookout for enthusiastic additions to the TripSit Team.
                      Begin your journey with the &quot;Intro to
                      TripSitting&quot; course on our learning platform. This
                      complimentary course equips you with the foundational
                      skills to excel as a TripSitter and integrates your
                      Discord account with your course progress.
                    </p>
                    <p>
                      Upon course completion, you&apos;ll have the opportunity
                      to join us as a Helper, actively participating in TripSit
                      sessions. Display consistent dedication and contribution,
                      and we&apos;ll be thrilled to welcome you as a
                      full-fledged TripSitter!
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label="Accordion 3"
                    startContent={<div className="accStart">🔍</div>}
                    title="Help with Research"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    classNames={accordionClassNames}
                  >
                    <p>
                      Interested in collaborating on our research projects?
                      We&apos;d love to have you on board. Start by{" "}
                      <a href="https://discord.gg/tripsit">
                        joining our Discord
                      </a>{" "}
                      and heading over to the #content room where all the
                      brainstorming and discussions take place.
                    </p>
                    <p>
                      The realm of substances is continually expanding, and
                      there&apos;s a constant need to refresh and augment our
                      wiki. If you have expertise or insights,{" "}
                      <a href="https://wiki.tripsit.me/index.php?title=Special:CreateAccount">
                        registration is open
                      </a>{" "}
                      for contributions. All updates and new entries are
                      channeled through our Discord for collaborative review and
                      refinement.
                    </p>
                    <p>
                      Our learning platform is at the forefront of disseminating
                      harm reduction knowledge. If you have ideas or content for
                      new courses, we&apos;re all ears. And if you have a flair
                      for data and details, our drug factsheet database beckons.
                      Dive deeper into the Development section for a clearer
                      picture of how you can play a part.
                    </p>
                  </AccordionItem>
                  <AccordionItem
                    key="4"
                    aria-label="Accordion 4"
                    startContent={<div className="accStart">💻</div>}
                    title="Assist with Development"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    classNames={accordionClassNames}
                  >
                    <h3>Services</h3>
                    <p>
                      All of our development is public on GitHub, and everything
                      is coded in Javascript:
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
                        <a href="https://github.com/TripSit/combogen">
                          Comboapp
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/TripSit/DXM-Calculator/">
                          DXM Calculator
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/TripSit/factsheets/">
                          Factsheets
                        </a>
                      </li>
                      <li>
                        <a href="https://volume.tripsit.me/">
                          Volumetric Converter
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/TripSit/webchat/">
                          Webchat
                        </a>
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
                      These projects have been converted to docker containers,
                      but more work is needed to add some standard functionality
                      to each container to make each project more uniform. Tasks
                      include:
                    </p>
                    <ul>
                      <li>Add Sonar linting. </li>
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
                      Keep in mind that TripSit has a rich history spanning over
                      a decade, built on legacy systems and a mosaic of
                      documentation and code. Navigating and contributing might
                      present its challenges initially. However, with
                      perseverance, a willingness to learn, and a dash of
                      patience, you&apos;ll find that no task is insurmountable.
                    </p>

                    <p>
                      <b>We’re also open to new project ideas!</b>
                    </p>
                    <h3>Android App</h3>
                    <p>
                      Our Android app is functional, but we believe there&apos;s
                      room for enhancement. If you have the skills and vision to
                      elevate its performance and design, wev&apos;d love to see
                      your touch. Dive into the codebase and contribute:{" "}
                      <a href="https://github.com/TripSit/tripsit-mobile">
                        https://github.com/TripSit/tripsit-mobile
                      </a>
                      .
                    </p>
                    <h3>Main Website</h3>
                    <p>
                      Our main website, built on NextJS, is envisioned as a
                      unified platform, seamlessly integrating our diverse
                      services. We welcome contributions of all sizes to enhance
                      its functionality and user experience. Dive in and make a
                      difference:{" "}
                      <a href="https://github.com/TripSit/website">
                        https://github.com/TripSit/website
                      </a>
                      .
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* <Appeal /> */}

        <section id="faq" className="faq">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>
                Answers to our most commonly asked questions. Is your question
                not here? Contact us using a method below!
              </p>
            </div>

            <div className="faq-list">
              <Accordion>
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  startContent={<div className="accStart">?</div>}
                  title="Can I print the combo chart?"
                  data-aos="fade-up"
                  classNames={accordionClassNames}
                >
                  <p>
                    TripSit hereby grants you a non-exclusive, non-transferable
                    license to use, reproduce, distribute, and display images
                    and content from TripSit, in accordance with the following
                    conditions:
                  </p>

                  <p>
                    <b>Non-commercial Use Only:</b> You are permitted to use our
                    images and content for purposes other than commercial
                    exploitation. This entails that you may print, distribute,
                    or display the images and content, but you are prohibited
                    from selling them or using them in any manner from which you
                    might derive direct or indirect monetary benefit.
                  </p>

                  <p>
                    <b>Attribution:</b> Any reproduction or distribution of our
                    images or content must attribute credit to TripSit. This can
                    be done by placing our
                    <a href="https://drive.google.com/file/d/16529Ykfx1E-BD7kfFn02HAqo1aMCwCwj/view?usp=drive_link">
                      logo with URL
                    </a>{" "}
                    in proximity to the image or content.
                  </p>

                  <p>
                    <b>No Derivative Works:</b> You are free to use our images
                    and content in their original form. However, you are
                    restricted from modifying, altering, or creating derivative
                    versions unless you obtain express written consent from
                    TripSit.
                  </p>

                  <p>
                    <b>No Warranty:</b> Our images and content are provided
                    &quot;as is&quot; without any form of warranty. TripSit
                    shall not bear any liability for losses, damages, or claims
                    stemming from your utilization of the images and content.
                  </p>

                  <p>
                    <b>Termination:</b> Breaching any term of this agreement
                    will result in the immediate revocation of your license to
                    use our images and content. Furthermore, TripSit retains the
                    right to terminate this license at its discretion and at any
                    time. This clause is a standard legal provision, and we do
                    not anticipate enacting it arbitrarily.
                  </p>

                  <p>
                    <b>Reservation of Rights:</b> All rights not explicitly
                    conferred by this agreement remain the property of TripSit.
                    We also reserve the right to amend the conditions of this
                    license as circumstances dictate.
                  </p>

                  <p>
                    By leveraging our images and content, you are confirming
                    your acceptance of and compliance with the terms delineated
                    above. We earnestly hope our materials prove beneficial for
                    your non-commercial ventures.
                  </p>

                  <p>
                    For inquiries or if you wish to seek permissions beyond the
                    scope of this license, please reach out through one of our
                    contact methods below.
                  </p>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Accordion 2"
                  startContent={<div className="accStart">?</div>}
                  title="What happened to the IRC?"
                  data-aos="fade-up"
                  classNames={accordionClassNames}
                >
                  <p>
                    Over a decade, we faced numerous challenges with IRC that
                    remained unresolved. Given our resource constraints,
                    ensuring a high-quality chat experience on IRC became
                    untenable.
                  </p>
                  <p>
                    Turning to Discord, we found the security and user-friendly
                    features that we had longed for with IRC. Furthermore, our
                    Discord bot has already made significant positive impacts in
                    the harm reduction communities of Bluelight and r/Drugs.
                  </p>
                  <p>
                    While the IRC remains accessible, its use is limited to
                    those with pre-existing accounts. We may consider new
                    account creation on a selective basis, but we currently have
                    no intentions of reopening the IRC to the general public.
                    Importantly, the IRC is fully integrated with Discord,
                    ensuring that no conversation is missed. Additionally,
                    we&apos;re in the process of setting up a Matrix server,
                    which aims to address any privacy concerns associated with
                    Discord and our reservations about relying on older software
                    platforms.
                  </p>
                </AccordionItem>
                <AccordionItem
                  key="3"
                  aria-label="Accordion 3"
                  startContent={<div className="accStart">?</div>}
                  title="Can I interview TripSit?"
                  data-aos="fade-up"
                  classNames={accordionClassNames}
                >
                  <p>
                    TripSit operates as a volunteer-driven organization, and
                    many of our members are engaged in full-time commitments.
                    While our availability for formal interviews might be
                    limited, we&apos;re always open to addressing questions and
                    engaging in discussions. The most effective way to reach out
                    to our team is via our Discord.
                  </p>
                </AccordionItem>
                <AccordionItem
                  key="4"
                  aria-label="Accordion 4"
                  startContent={<div className="accStart">?</div>}
                  title="I sent an email and you didn't respond, what gives?"
                  data-aos="fade-up"
                  classNames={accordionClassNames}
                >
                  <p>
                    We apologize for the oversight. As a tight-knit volunteer
                    team, we occasionally struggle to keep up with the influx of
                    emails. We&apos;re striving to improve our response time.
                    For a quicker response or more direct engagement, reaching
                    out to us on Discord is highly recommended.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Contact</h2>
              <p>
                <b>The best way to contact the team is to join the Discord. </b>
              </p>
            </div>

            <div className="row mt-5">
              <div className="col-lg-4">
                <div className="info">
                  <div className="discord">
                    <i className="bx bxl-discord"></i>
                    <h4>
                      <a href="https://discord.gg/tripsit">Discord</a>
                    </h4>
                  </div>

                  <div className="appeals">
                    <i className="bx bxl-discord"></i>
                    <h4>
                      <a href="https://tripbot.info/dashboard/appeals">
                        Ban Appeals
                      </a>
                    </h4>
                  </div>

                  <div className="twitter">
                    <i className="bx bxl-twitter"></i>
                    <h4>
                      <a href="https://twitter.com/teamtripsit">Twitter</a>
                    </h4>
                  </div>

                  <div className="facebook">
                    <i className="bx bxl-facebook"></i>
                    <h4>
                      <a href="https://www.facebook.com/TripSitme">Facebook</a>
                    </h4>
                  </div>

                  <div className="reddit">
                    <i className="bx bxl-reddit"></i>
                    <h4>
                      <a href="http://reddit.com/r/TripSit">Reddit</a>
                    </h4>
                  </div>

                  <div className="irc">
                    <i className="bx bx-network-chart"></i>
                    <h4>
                      <a href="http://lounge.tripsit.me">IRC</a>
                    </h4>
                  </div>

                  <div className="matrix">
                    <i className="ri-sparkling-line"></i>
                    <h4>
                      <a href="http://element.tripsit.me">Matrix</a>
                    </h4>
                  </div>
                </div>
              </div>
              {/* 
              <div className="col-lg-8 mt-5 mt-lg-0">
                <form
                  action="forms/contact.php"
                  method="post"
                  role="form"
                  className="php-email-form"
                >
                  <div className="row gy-2 gx-md-3">
                    <div className="col-md-6 form-group">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                    <div className="form-group col-12">
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        id="subject"
                        placeholder="Subject"
                        required
                      />
                    </div>
                    <div className="form-group col-12">
                      <textarea
                        className="form-control"
                        name="message"
                        rows={5}
                        placeholder="Message"
                        required
                      ></textarea>
                    </div>
                    <div className="my-3 col-12">
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">
                        Your message has been sent. Thank you!
                      </div>
                    </div>
                    <div className="text-center col-12">
                      <button type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
              </div> */}
        {/* </div>
          </div>
        </section> */}
      </main>

      <Footer />

      {/* <div id="preloader"></div>  */}
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
}
