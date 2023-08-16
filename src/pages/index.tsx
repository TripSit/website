// import Head from 'next/head';
import Image from "next/image";
// import PureCounterComponent from "@/components/PureCounter";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";
import Collapsible from "react-collapsible";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bluelightLogo from "../../public/assets/img/clients/bluelight.jpg";
import seiLogo from "../../public/assets/img/clients/sei.png";
import rdrugsLogo from "../../public/assets/img/clients/rdrugs.png";
import pwLogo from "../../public/assets/img/clients/pw.png";
import mapsLogo from "../../public/assets/img/clients/maps.png";
import dancesafeLogo from "../../public/assets/img/clients/dancesafeYellow.png";
// import portfolio1 from "../../public/assets/img/portfolio/portfolio-1.jpg";
// import portfolio2 from "../../public/assets/img/portfolio/portfolio-2.jpg";
// import portfolio3 from "../../public/assets/img/portfolio/portfolio-3.jpg";
// import portfolio4 from "../../public/assets/img/portfolio/portfolio-4.jpg";
// import portfolio5 from "../../public/assets/img/portfolio/portfolio-5.jpg";
// import portfolio6 from "../../public/assets/img/portfolio/portfolio-6.jpg";
// import portfolio7 from "../../public/assets/img/portfolio/portfolio-7.jpg";
// import portfolio8 from "../../public/assets/img/portfolio/portfolio-8.jpg";
// import portfolio9 from "../../public/assets/img/portfolio/portfolio-9.jpg";
// import team1 from "../../public/assets/img/team/team-1.jpg";
// import team2 from "../../public/assets/img/team/team-2.jpg";
// import team3 from "../../public/assets/img/team/team-3.jpg";
// import team4 from "../../public/assets/img/team/team-4.jpg";
import comboChart from "../../public/assets/img/comboChart.png";
import logo from "../../public/assets/img/logo.png";

import CounterNew from "../components/Counter";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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
  return (
    <div>
      <Header />
      <section id="hero" className="d-flex align-items-center">
        <div
          className="container position-relative"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9 text-center">
              <h1>
                <a href="https://tripsit.io" className="logo">
                  <Image src={logo} alt="" className="img-fluid" width={400} />
                </a>
              </h1>
              <h2>Harm Reduction Through Education</h2>
            </div>
          </div>
          <div className="text-center">
            <a href="#about" className="btn-get-started scrollto">
              I want to talk to a Trip Sitter
            </a>
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
                  <a href="">Combo Chart</a>
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
                  <a href="">Drug Factsheets</a>
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
                  <a href="">Join the Discord</a>
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
                  <a href="">Learn on Moodle</a>
                </h4>
                <p className="description">
                  Our free learning platform gives you valuable skills starting
                  with our first course &quot;Intro to Tripsitting&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <a href="#" className="btn-learn-more">
                  Learn More
                </a>
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
                    <CounterNew data={serviceYears} />
                  </span>
                  {/* <span data-purecounter-start="0" data-purecounter-end="65" data-purecounter-duration="2" class="purecounter"></span> */}
                  {/* <span className="purecounter">testing</span> */}
                  <p>Years of Service</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <CounterNew data={discordMembers} />
                  </span>
                  <p>Discord Members</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <CounterNew data={databaseDrugs} />
                  </span>
                  <p>Drugs in our Database</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-5 col-6 d-md-flex align-items-md-stretch">
                <div className="count-box">
                  <span>
                    <CounterNew data={subredditSubscribers} />
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
                <a href="https://combo.tripsit.me/" className="mb-4"></a>
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
                  Full details are on the
                  <a href="https://wiki.tripsit.me/wiki/Drug_combinations#Use_.26_Attribution ">
                    {" "}
                    usage page
                  </a>{" "}
                  but it boils down to:
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
                <Image src={pwLogo} className="img-fluid" alt="" height={100} />
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <Image
                  src={bluelightLogo}
                  className="img-fluid"
                  alt=""
                  height={100}
                />
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <Image
                  src={seiLogo}
                  className="img-fluid"
                  alt=""
                  height={100}
                />
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <Image
                  src={rdrugsLogo}
                  className="img-fluid"
                  alt=""
                  height={100}
                />
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <Image
                  src={mapsLogo}
                  className="img-fluid"
                  alt=""
                  height={100}
                />
              </div>

              <div
                className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                data-aos="zoom-in"
              >
                <Image
                  src={dancesafeLogo}
                  className="img-fluid"
                  alt=""
                  height={100}
                />
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
                // eslint-disable-next-line arrow-parens
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
              >
                <SwiperSlide>
                  <div className="testimonial-item">
                    <p>
                      <i className="bx bxs-quote-alt-left quote-icon-left"></i>I
                      wanted to give a big kudos and air five...you know, covid
                      haha...to everyone on the tripsit team. Even the community
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
                      just want to give huge hugs to every member of the TRIPSIT
                      TEAM for being so active member here ❤️ I love you guys
                      for being here, helping people and giving your free time
                      to grow a positive community for everyone to share their
                      stories and lifes that are surrounded by drugs. Places
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
                      Tripsit a better and more useful service, everyday!
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

        <section id="services" className="services">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Services</h2>
              <p>
                TripSit offers various services, all free of charge, and
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
                    <a href="">Combo App</a>
                  </h4>
                  <p>
                    Our combo chart if fuckin&apos; sweet mate. Check it out
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
                    <a href="">Drug Factsheets</a>
                  </h4>
                  <p>Our factsheet are quick references to substances.</p>
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
                    <a href="">Substance Wiki</a>
                  </h4>
                  <p>
                    Our wiki is choc full of drug and herbal information.
                    Account registration is open and informed changes are
                    welcome. Want to help out here? Join the discord #content
                    room to coodrinate with the team!
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
                    <a href="">Benzo Converter</a>
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
                    <a href="">DXM Calculator</a>
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
                    <a href="">Volumetric Converter</a>
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
                    <a href="">Learning Platform</a>
                  </h4>
                  <p>
                    Our learning platform gives the community a place to take
                    courses and prove they know what they&apos;re taling about.
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
                    <a href="">TripSit Discord Bot</a>
                  </h4>
                  <p>
                    Our discord bot is a moderation tool and tripsit-session
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
                    <a href="">Android Mobile App</a>
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
                {" "}
                We are always looking for talented people with all sorts of
                skill sets. We have multiple development projects that need
                maintenance, and our drug information can always use additions
                of new substances. Everything needs to be tested and proof-read.
                The smallest contribution is apprecated!
              </p>
              <a className="cta-btn" href="#">
                How to Help TripSit
              </a>
            </div>
          </div>
        </section>

        {/* <section id="portfolio" className="portfolio">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Portfolio</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div className="row" data-aos="fade-up" data-aos-delay="150">
              <div className="col-lg-12 d-flex justify-content-center">
                <ul id="portfolio-flters">
                  <li data-filter="*" className="filter-active">
                    All
                  </li>
                  <li data-filter=".filter-app">App</li>
                  <li data-filter=".filter-card">Card</li>
                  <li data-filter=".filter-web">Web</li>
                </ul>
              </div>
            </div>

            <div
              className="row portfolio-container"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="col-lg-4 col-md-6 portfolio-item filter-app">
                <div className="portfolio-wrap">
                  <Image src={portfolio1} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>App 1</h4>
                    <p>App</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-1.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="App 1"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-wrap">
                  <Image src={portfolio2} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Web 3</h4>
                    <p>Web</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-2.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Web 3"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-app">
                <div className="portfolio-wrap">
                  <Image src={portfolio3} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>App 2</h4>
                    <p>App</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-3.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="App 2"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-card">
                <div className="portfolio-wrap">
                  <Image src={portfolio4} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Card 2</h4>
                    <p>Card</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-4.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Card 2"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-wrap">
                  <Image src={portfolio5} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Web 2</h4>
                    <p>Web</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-5.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Web 2"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-app">
                <div className="portfolio-wrap">
                  <Image src={portfolio6} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>App 3</h4>
                    <p>App</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-6.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="App 3"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-card">
                <div className="portfolio-wrap">
                  <Image src={portfolio7} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Card 1</h4>
                    <p>Card</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-7.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Card 1"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-card">
                <div className="portfolio-wrap">
                  <Image src={portfolio8} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Card 3</h4>
                    <p>Card</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-8.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Card 3"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 portfolio-item filter-web">
                <div className="portfolio-wrap">
                  <Image src={portfolio9} className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Web 3</h4>
                    <p>Web</p>
                    <div className="portfolio-links">
                      <a
                        href="assets/img/portfolio/portfolio-9.jpg"
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title="Web 3"
                      >
                        <i className="bx bx-plus"></i>
                      </a>
                      <a href="portfolio-details.html" title="More Details">
                        <i className="bx bx-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* <section id="team" className="team">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Team</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div className="row">
              <div
                className="col-lg-3 col-md-6 d-flex align-items-stretch"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="member">
                  <div className="member-img">
                    <Image src={team1} className="img-fluid" alt="" />
                    <div className="social">
                      <a href="">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                  <div className="member-info">
                    <h4>Walter White</h4>
                    <span>Chief Executive Officer</span>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3 col-md-6 d-flex align-items-stretch"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="member">
                  <div className="member-img">
                    <Image src={team2} className="img-fluid" alt="" />
                    <div className="social">
                      <a href="">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                  <div className="member-info">
                    <h4>Sarah Jhonson</h4>
                    <span>Product Manager</span>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3 col-md-6 d-flex align-items-stretch"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="member">
                  <div className="member-img">
                    <Image src={team3} className="img-fluid" alt="" />
                    <div className="social">
                      <a href="">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                  <div className="member-info">
                    <h4>William Anderson</h4>
                    <span>CTO</span>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3 col-md-6 d-flex align-items-stretch"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="member">
                  <div className="member-img">
                    <Image src={team4} className="img-fluid" alt="" />
                    <div className="social">
                      <a href="">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                  <div className="member-info">
                    <h4>Amanda Jepson</h4>
                    <span>Accountant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* <section id="pricing" className="pricing">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Pricing</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div className="row">
              <div
                className="col-lg-4 col-md-6"
                data-aos="zoom-im"
                data-aos-delay="100"
              >
                <div className="box">
                  <h3>Free</h3>
                  <h4>
                    <sup>$</sup>0<span> / month</span>
                  </h4>
                  <ul>
                    <li>Aida dere</li>
                    <li>Nec feugiat nisl</li>
                    <li>Nulla at volutpat dola</li>
                    <li className="na">Pharetra massa</li>
                    <li className="na">Massa ultricies mi</li>
                  </ul>
                  <div className="btn-wrap">
                    <a href="#" className="btn-buy">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 mt-4 mt-md-0"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="box featured">
                  <h3>Business</h3>
                  <h4>
                    <sup>$</sup>19<span> / month</span>
                  </h4>
                  <ul>
                    <li>Aida dere</li>
                    <li>Nec feugiat nisl</li>
                    <li>Nulla at volutpat dola</li>
                    <li>Pharetra massa</li>
                    <li className="na">Massa ultricies mi</li>
                  </ul>
                  <div className="btn-wrap">
                    <a href="#" className="btn-buy">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-4 col-md-6 mt-4 mt-lg-0"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="box">
                  <h3>Developer</h3>
                  <h4>
                    <sup>$</sup>29<span> / month</span>
                  </h4>
                  <ul>
                    <li>Aida dere</li>
                    <li>Nec feugiat nisl</li>
                    <li>Nulla at volutpat dola</li>
                    <li>Pharetra massa</li>
                    <li>Massa ultricies mi</li>
                  </ul>
                  <div className="btn-wrap">
                    <a href="#" className="btn-buy">
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

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
              <ul>
                <li data-aos="fade-up">
                  <Collapsible
                    trigger="Can I print the combo chart?"
                    triggerTagName="a"
                    open
                  >
                    <p>Abolsultely! Check out the combo chart section above.</p>
                  </Collapsible>
                </li>

                <li data-aos="fade-up" data-aos-delay="100">
                  <Collapsible
                    trigger="What happened to the IRC?"
                    triggerTagName="a"
                  >
                    <p>
                      There are many issues we could not resolve after a decade
                      of trying to work with IRC, and it became impossible to
                      sustain a quality chat with the amount of resources we
                      have.
                      <br />
                      <br /> Instead, Discord has provided the much-needed
                      security and quality of life features we wish IRC could
                      have given us, and our discord bot has already
                      revolutionized the harm reduction communities of Bluelight
                      and r/Drugs.
                      <br />
                      <br /> The IRC is still available, but it&apos;s
                      restricted to those who had an existing account. New
                      accounts can be created on a case-by-case basis, but the
                      we have no plans to bring the IRC back to the open public.
                      However, the IRC is completely bridged to discord, so
                      there&apos;s nothing to miss, and we&apos;re working on a
                      Matrix server that shold resolve privacy concerns with
                      using discord and our team&apos;s concerns with using
                      legacy software.
                    </p>
                  </Collapsible>
                </li>

                <li data-aos="fade-up" data-aos-delay="200">
                  <Collapsible
                    trigger="Can I interview TripSit?"
                    triggerTagName="a"
                  >
                    <p>
                      As a volunteer organization whos members all work
                      full-time, we do not have a lot of free time to schedule
                      interviews, but we are open to questions. The best way to
                      contact the team is through the discord.
                    </p>
                  </Collapsible>
                </li>

                <li data-aos="fade-up" data-aos-delay="300">
                  <Collapsible
                    trigger="I sent an email and you didn't respond, what gives?"
                    triggerTagName="a"
                  >
                    <p>
                      Yeah, we suck at email, but we&apos;re working on it. We
                      are a very small volunteer team and email slips through
                      the cracks a lot. Discord is the best place to reach the
                      team.
                    </p>
                  </Collapsible>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Contact</h2>
              <p>
                The best way to contact the team is to join the Discord. You can
                also send us a message with the contact form below!
              </p>
            </div>

            <div className="row mt-5">
              <div className="col-lg-4">
                <div className="info">
                  <div className="address">
                    <i className="bi bi-geo-alt"></i>
                    <h4>Discord:</h4>
                    <p>https://www.discord.gg/tripsit</p>
                  </div>

                  <div className="email">
                    <i className="bi bi-envelope"></i>
                    <h4>Reddit:</h4>
                    <p>https://www.reddit.com/r/TripSit/</p>
                  </div>

                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>IRC:</h4>
                    <p>irc.tripsit.me</p>
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
