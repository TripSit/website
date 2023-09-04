/* eslint-disable arrow-parens */
import Image from "next/image";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";
import { Tooltip, Accordion, AccordionItem, Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "../components/Head";
import bluelightLogo from "../../public/assets/img/clients/bluelight.jpg";
import seiLogo from "../../public/assets/img/clients/sei.png";
import rdrugsLogo from "../../public/assets/img/clients/rdrugs.png";
import pwLogo from "../../public/assets/img/clients/pw.png";
import mapsLogo from "../../public/assets/img/clients/maps.png";
import dancesafeLogo from "../../public/assets/img/clients/dancesafeYellow.png";
import comboChart from "../../public/assets/img/comboChart.png";
import logo from "../../public/assets/img/logo.png";
import Ghost from "../components/Ghost";
import Particles from "../components/Particles";
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

const serviceYears = {
  startNum: 0,
  endNum: 11,
  duration: 4,
  delay: 1,
};

const discordMembers = {
  startNum: 0,
  endNum: 6347,
  duration: 4,
  delay: 1,
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

export default function Home() {
  const router = useRouter();

  const gotoWebchat = () => {
    router.push("/webchat");
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
              <div className="icon-box">
                <div className="icon">
                  <i className="ri-stack-line"></i>
                </div>
                <h4 className="title">
                  <a
                    href="https://combo.tripsit.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Combo Chart
                  </a>
                </h4>
                <p className="description">
                  Check out our combination chart that shows the results of
                  mixing common drugs.
                </p>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="ri-palette-line"></i>
                </div>
                <h4 className="title">
                  <a
                    href="https://drugs.tripsit.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Drug Factsheets
                  </a>
                </h4>
                <p className="description">
                  Even more details on drug information including dosages and
                  durations.
                </p>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="ri-command-line"></i>
                </div>
                <h4 className="title">
                  <a
                    href="https://discord.gg/tripsit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join the Discord
                  </a>
                </h4>
                <p className="description">
                  Join our awesome community! Our discord is where nearly
                  everything is planned and executed.
                </p>
              </div>
            </div>

            <div
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="ri-fingerprint-line"></i>
                </div>
                <h4 className="title">
                  <a
                    href="https://learn.tripsit.me"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn on Moodle
                  </a>
                </h4>
                <p className="description">
                  Our free learning platform gives you valuable skills starting
                  with our first course &quot;Intro to TripSitting&quot;
                </p>
              </div>
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
                In a world where help often falls short, TripSit bridges the
                gap. We&apos;re on a mission to dispel drug-use taboos and equip
                individuals with the resources to stay safe.{" "}
              </p>
            </div>

            <div className="row content">
              <div className="col-lg-6">
                <p>Our core ideas are simple:</p>
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
                    <i className="ri-check-double-line"></i> Understand that
                    education on how to stay safe is the best way to reduce
                    harm.
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 pt-4 pt-lg-0">
                <p>
                  At TripSit, we focus on the open discussion and implementation
                  of harm reduction strategies. We not only advocate for tools
                  like test kits but also offer guidance for safer drug usage.
                  Our platform encourages dialogue about scientific, medical,
                  and philosophical perspectives on drugs, providing advice
                  drawn from our collective life experiences.
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
                      In a world where help often falls short, TripSit bridges
                      the gap. We&apos;re on a mission to dispel drug-use taboos
                      and equip individuals with the resources to stay safe.
                    </p>
                    <p>
                      At TripSit, we focus on the open discussion and
                      implementation of harm reduction strategies. We not only
                      advocate for tools like test kits but also offer guidance
                      for safer drug usage. Our platform encourages dialogue
                      about scientific, medical, and philosophical perspectives
                      on drugs, providing advice drawn from our collective life
                      experiences.
                    </p>
                    <p>
                      Recognizing that people will use drugs regardless of
                      legality, we aim to mitigate the risks of reckless or
                      uninformed consumption. Our support extends from providing
                      someone to talk to and advice on safe dosage to
                      recommending resources for recovery.
                    </p>
                    <p>
                      Our community offers a 24/7 live chat for immediate
                      assistance and a drug-information wiki for quick facts. We
                      also host a live radio service for companionship through
                      music.
                    </p>
                    <p>
                      We are a team of dedicated volunteers, not trained
                      professionals. Our services aim to assist those who need
                      information, a non-judgmental ear, a testing kit, or
                      simply a friendly place to hang out.
                    </p>
                    <p>
                      TripSit does not promote drug use or abuse. Our network
                      serves users who have already decided to take drugs, with
                      a focus on their safety. We strongly discourage dangerous
                      drug combinations and have zero tolerance toward
                      discussions of self-harm or suicide.
                    </p>
                    <p>
                      While we are not a substitute for professional medical
                      help, we strive to provide advice and positive support to
                      individuals already engaged in drug use. We inform users
                      about potential side effects, addiction risks, and harmful
                      drug interactions.
                    </p>
                    <p>
                      We are a refuge for those hesitant to seek advice due to
                      social stigma, offering advice, support, and positivity.
                      By challenging draconian attitudes towards drug use,
                      TripSit aims to provide potentially life-saving
                      information and resources.
                    </p>
                    <p>
                      From all of us at TripSit: Stay safe and stay informed.
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
                    <Counter data={serviceYears} />
                  </span>
                  <p>Years of Service</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <Counter data={discordMembers} />
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
                  href="https://reddit.com/r/drugs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip content="r/Drugs" placement="bottom">
                    <Image src={rdrugsLogo} className="logo img-fluid" alt="" />
                  </Tooltip>
                </a>
              </div>

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
                    <i className="bx bxl-dribbble"></i>
                  </div>
                  <h4>
                    <a href="https://combo.tripsit.me/">Combo App</a>
                  </h4>
                  <p>
                    Our combo chart is fuckin&apos; sweet mate. Check it out
                    here.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <div className="icon-box iconbox-orange ">
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
                    <i className="bx bx-file"></i>
                  </div>
                  <h4>
                    <a href="https://drugs.tripsit.me">Drug Factsheets</a>
                  </h4>
                  <p>Our factsheets are quick references to substances.</p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
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
                    <i className="bx bx-tachometer"></i>
                  </div>
                  <h4>
                    <a href="https://wiki.tripsit.me/wiki/Main_Page">
                      Substance Wiki
                    </a>
                  </h4>
                  <p>
                    Our wiki is choc full of drug and herbal information.
                    Account registration is open and informed changes are
                    welcome. Want to help out here? Join the discord #content
                    room to coordinate with the team!
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
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
                    <i className="bx bx-layer"></i>
                  </div>
                  <h4>
                    <a href="https://benzos.tripsit.me/">Benzo Converter</a>
                  </h4>
                  <p>Roughly convert one benzodiazepine type into another.</p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
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
                    <i className="bx bx-slideshow"></i>
                  </div>
                  <h4>
                    <a href="https://dxm.tripsit.me/">DXM Calculator</a>
                  </h4>
                  <p>
                    Calculate the ideal safe dosage for DXM based on your body
                    weight.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
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
                    <i className="bx bx-arch"></i>
                  </div>
                  <h4>
                    <a href="https://volume.tripsit.me/">
                      Volumetric Converter
                    </a>
                  </h4>
                  <p>
                    When dealing with powders that are active on the microgram
                    (ug) scale, it can be safer to make a solution (liquid)
                    containing your substance. This spreads out the substance
                    and makes it easier to dose a smaller amount.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
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
                    <i className="bx bx-layer"></i>
                  </div>
                  <h4>
                    <a href="https://learn.tripsit.me">Learning Platform</a>
                  </h4>
                  <p>
                    Our learning platform gives the community a place to take
                    courses and prove they know what they&apos;re talking about.
                    Our open source philosophy allows almost anyone to create a
                    course if they wanted.
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
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
                    <i className="bx bx-slideshow"></i>
                  </div>
                  <h4>
                    <a href="https://tripbot.info/">TripSit Discord Bot</a>
                  </h4>
                  <p>
                    Our discord bot is a moderation tool and TripSit-session
                    handling system all-in-one. It aims to help not only
                    TripSit, but any discord guild that wants to add it. Want to
                    make your own TripSit franchise? Now anyone has the tools to
                    do that, and development is open source, so community
                    feedback is always welcome and used!
                  </p>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
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
                    <i className="bx bx-arch"></i>
                  </div>
                  <h4>
                    <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile">
                      Android Mobile App
                    </a>
                  </h4>
                  <p>
                    Take our drug information on-the-go and have offline access
                    to our factsheets and combo information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="cta">
          <div className="container" data-aos="zoom-in">
            <div className="text-center">
              <h3>Want to help out?</h3>
              <p>
                TripSit is a very small org run by volunteers. Everyone can help
                keep the mission going with their own skill set, including just
                being a awesome and chatting in the lounge. We have multiple
                development projects that need maintenance, and our drug
                information can always use additions of new substances.
                Everything needs to be tested and proof-read, and the smallest
                contribution is appreciated!
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
                      Our community is full of awesome, positive people who
                      likely share a few common interests, excluding the
                      obvious. We have a{" "}
                      <a href="https://steamcommunity.com/groups/TripSit">
                        Steam community{" "}
                      </a>
                      to play games and various channels showing off our pets,
                      food, and artistic creations. We would not exist without
                      our incredible community!{" "}
                      <a href="https://discord.gg/tripsit">Join the discord</a>,
                      say hi, and get to know the group; you won’t regret it!
                    </p>
                    <p>
                      Discord is also where coordination on other projects and
                      our open-source development happens. Even if you just want
                      to watch the progress, Discord is where that happens!
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
                      If you are like us and desire to help people, you may be
                      what we are looking for. We are always looking for new
                      TripSit Team members, and that journey starts with our
                      Intro to TripSitting course on our learning platform. This
                      free course gets you started on being a decent TripSitter
                      and allows you to “link” your discord account with your
                      learning platform progress.
                    </p>
                    <p>
                      Once you complete the course, you can become a helper and
                      start helping out in TripSit sessions. Assist enough as a
                      Helper, and we’ll invite you to the team as a full
                      TripSitter!
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
                      Make sure to{" "}
                      <a href="https://discord.gg/tripsit">Join the discord</a>{" "}
                      and say hi in the #content room where we discuss all our
                      research projects!
                    </p>
                    <p>
                      New substances are always being created, and we can always
                      use new articles or updates to our wiki.
                      <a href="https://wiki.tripsit.me/index.php?title=Special:CreateAccount">
                        Registration is open
                      </a>{" "}
                      , and updates are posted to our Discord for tracking and
                      auditing.{" "}
                    </p>
                    <p>
                      Our learning platform enables us to create harm reduction
                      courses and provide them to the community for free. New
                      course ideas are always floating around in various states
                      of progress, and if anyone creates a draft course, we can
                      add it to the site.<p></p>Our drug factsheet database can
                      also use updates and additions, check out the Development
                      section for more info on this.
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
                      Please remember that TripSit is over a decade old with
                      legacy systems and a patchwork of documentation and code.
                      It may not be super easy to jump into the stuff we need to
                      do, but if you have patience and are willing to learn,
                      anything is possible.
                    </p>
                    <p>
                      <b>We’re also open to new project ideas!</b>
                    </p>
                    <h3>Android App</h3>
                    <p>
                      Our Android app works! That’s about all the good I can say
                      about it right now. Think you can do better? Please do.
                      The code is public here:
                      https://github.com/TripSit/tripsit-mobile
                    </p>
                    <h3>Main Website</h3>
                    <p>
                      This website is a NextJS project that intends to allow
                      future development to integrate our various services into
                      a single application. Even the smallest pull request is
                      appreciated! https://github.com/TripSit/website
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>
                Answers to our most commonly asked questions. Is your question
                not here? Send us a contact form below!
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
                    TripSit grants you a non-exclusive, non-transferable license
                    to use, reproduce, distribute, and display the images and
                    work from TripSit, subject to the conditions below.
                  </p>
                  <p>
                    <b>Non-commercial Use Only:</b> You can use our images and
                    work for any purpose except commercially. This means you can
                    print, distribute, or display the images and work, but you
                    cannot sell them or use them in any way you derive monetary
                    profit from directly or indirectly.
                  </p>
                  <p>
                    <b>Attribution:</b> All reproductions of our images and work
                    must be credited to TripSit by placing our{" "}
                    <a href="https://drive.google.com/file/d/16529Ykfx1E-BD7kfFn02HAqo1aMCwCwj/view?usp=drive_link">
                      logo with URL{" "}
                    </a>
                    near the image/work.
                  </p>
                  <p>
                    <b>No Derivative Works:</b> While free to use our images and
                    work, you cannot modify, alter, or create derivative works
                    without express written permission from TripSit.
                  </p>
                  <p>
                    <b>No Warranty:</b> Our images and work are provided “as is”
                    without warranties. TripSit is not liable for any losses,
                    damages, or claims arising from your use of the images and
                    work.
                  </p>
                  <p>
                    <b>Termination:</b> If you breach any agreement terms, your
                    license to use our images and work ends immediately.
                    Additionally, TripSit reserves the right to terminate this
                    license at any time for any reason, however we have no
                    intention of doing so, this is just a legal formality.
                  </p>
                  <p>
                    <b>Reservation of Rights:</b> All rights not expressly
                    granted in this agreement are reserved by TripSit. We
                    reserve the right to modify the terms of this license at any
                    time.
                  </p>
                  <p></p>
                  <p>
                    By using our images and work, you acknowledge and agree to
                    the terms and conditions outlined above. We sincerely hope
                    our resources will be valuable to your non-commercial
                    endeavors.
                  </p>
                  <p>
                    If you have questions or wish to seek permissions beyond the
                    scope of this license, please use the contact form below.
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
                    There are many issues we could not resolve after a decade of
                    trying to work with IRC, and it became impossible to sustain
                    a quality chat with the amount of resources we have.
                  </p>
                  <p>
                    Instead, Discord has provided the much-needed security and
                    quality of life features we wish IRC could have given us,
                    and our discord bot has already revolutionized the harm
                    reduction communities of Bluelight and r/Drugs.
                  </p>
                  <p>
                    The IRC is still available, but it&apos;s restricted to
                    those who had an existing account. New accounts can be
                    created on a case-by-case basis, but the we have no plans to
                    bring the IRC back to the open public. However, the IRC is
                    completely bridged to discord, so there&apos;s nothing to
                    miss, and we&apos;re working on a Matrix server that should
                    resolve privacy concerns with using discord and our
                    team&apos;s concerns with using legacy software.
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
                    As a volunteer organization with members who all work
                    full-time, we do not have a lot of free time to schedule
                    interviews, but we are open to questions. The best way to
                    contact the team is through the discord.
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
                    Yeah, we suck at email, but we&apos;re working on it. We are
                    a very small volunteer team and email slips through the
                    cracks a lot. Discord is the best place to reach the team.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Contact</h2>
              <p>
                <b>The best way to contact the team is to join the Discord. </b>
                You can also send us a message with the contact form below!
              </p>
            </div>

            <div className="row mt-5">
              <div className="col-lg-4">
                <div className="info">
                  <div className="address">
                    <i className="bi bi-geo-alt"></i>
                    <h4>
                      <a href="https://discord.gg/tripsit">Discord</a>
                    </h4>
                  </div>

                  <div className="email">
                    <i className="bi bi-envelope"></i>
                    <h4>
                      <a href="https://tripbot.info/dashboard/appeals">
                        Ban Appeals
                      </a>
                    </h4>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>
                      <a href="https://twitter.com/teamtripsit">Twitter</a>
                    </h4>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>
                      <a href="https://www.facebook.com/TripSitme">Facebook</a>
                    </h4>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>
                      <a href="http://reddit.com/r/TripSit">Reddit</a>
                    </h4>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>
                      <a href="http://lounge.tripsit.me">IRC</a>
                    </h4>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>
                      <a href="http://element.tripsit.me">Matrix</a>
                    </h4>
                  </div>
                </div>
              </div>

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
              </div>
            </div>
          </div>
        </section>
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
