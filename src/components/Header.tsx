import Image from "next/image";
import { Tooltip } from "@mui/material";
import logo from "../../public/assets/img/logo.png";
import ProfileButton from "./ProfileButton";

function Header() {
  const domain = `https://${process.env.NEXT_PUBLIC_DNS_DOMAIN}`;
  return (
    <header
      id="header"
      className="fixed-top navbar navbar-expand-lg bg-dark"
      data-bs-theme="dark"
    >
      <div className="container d-flex align-items-center justify-content-between">
        <a href={domain} className="logo">
          <Image src={logo} alt="" className="logoImage" />
        </a>

        <nav id="navbar" className="navbar navbar-expand-lg bg-dark">
          <ul>
            <li>
              <a className="nav-link scrollto active" href={`${domain}#hero`}>
                Home
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href={`${domain}#about`}>
                About
              </a>
            </li>
            <li className="nav-link scrollto dropdown">
              <a href={`${domain}#resources`}>
                <span>Resources</span> <i className="bi bi-chevron-down"></i>
              </a>
              <ul>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Drug Info</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Main_Page`}
                      >
                        Wiki
                      </a>
                    </li>
                    <li>
                      <a href={`${domain}/factsheets`}>Factsheets</a>
                    </li>
                    <li>
                      <a
                        href={`https://combo.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}
                      >
                        Comboapp
                      </a>
                    </li>
                    <li>
                      <a href={`${domain}#faq`}>Printing Information</a>
                    </li>
                    <li>
                      <a href="https://www.reddit.com/r/Drugs/comments/131q1yb/the_drug_users_bible_download_it_free_of_charge/">
                        Drug User&apos;s Handbook
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Calculators</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href={`https://dxm.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}
                      >
                        DXM Dosage
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://volume.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}
                      >
                        Volumetric
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://benzos.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}
                      >
                        Benzo Conversion
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Test Kits</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a href="https://dancesafe.org/product-category/testing-strips/">
                        DanceSafe (Worldwide)
                      </a>
                    </li>
                    <Tooltip
                      title="This link helps support TripSit!"
                      placement="left"
                      color="secondary"
                    >
                      <li>
                        <a href="https://protestkit.eu/shop/?coupon_code=tripsit">
                          ProTest (Europe) (10% off with &apos;TripSit&apos;)
                        </a>
                      </li>
                    </Tooltip>
                    <Tooltip
                      title="This link helps support TripSit!"
                      placement="left"
                      color="secondary"
                    >
                      <li>
                        <a href="https://www.reagent-tests.uk/shop/">
                          ReagentTests (UK) (10% off with
                          &apos;tripsitwiki&apos;)
                        </a>
                      </li>
                    </Tooltip>
                    <li>
                      <a href="https://ez-test.com.au/">EZ Test (Australia)</a>
                    </li>
                    <li>
                      <a href="https://www.testdrogue.fr/">
                        Test Drogue (France)
                      </a>
                    </li>
                    <li>
                      <a href="https://dancesafe.org/testing-kit-instructions/">
                        Test Kit Instructions
                      </a>
                    </li>
                    <li>
                      <a href="https://dancesafe.org/fentanyl">
                        Fentanyl strip guide
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href={`https://learn.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}
                  >
                    Learning Platform
                  </a>
                </li>
                <li>
                  <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile&hl=en_US&gl=US">
                    Android App
                  </a>
                </li>
                <li>
                  <a
                    href={`https://uptime.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/status/default`}
                  >
                    Service Status
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a
                href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Category:Guides`}
              >
                <span>Guides</span> <i className="bi bi-chevron-down"></i>
              </a>
              <ul>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Harm Reduction</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Common_Misconceptions_About_Psychedelics`}
                      >
                        Psychedelic Myths
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Test_Kits`}
                      >
                        Test Kits
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Scales`}
                      >
                        Scales
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Storage`}
                      >
                        Storage
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Sources_for_Laboratory_Analysis`}
                      >
                        Laboratory Analysis
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>TripSitting</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a href="https://learn.tripsit.me">
                        Intro to TripSitting
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Hallucinogens`}
                      >
                        Hallucinogens
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/How_To_Tripsit_In_Real_Life`}
                      >
                        TripSit in real life
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/How_To_Tripsit_Online`}
                      >
                        TripSit online
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/How_To_Deal_With_A_Bad_Trip`}
                      >
                        Deal with a bad trip
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Recovery</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Quick_Guide_to_Stimulant_Comedowns`}
                      >
                        Stimulant Comedowns
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/HPPD`}
                      >
                        HPPD
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Guide_to_Withdrawals`}
                      >
                        Guide to Withdrawals
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Addiction`}
                      >
                        Addiction
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Professional_Help_Resources`}
                      >
                        Professional Help Resources
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Dosing</span> <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Quick_Guide_to_Volumetric_Dosing`}
                      >
                        Volumetric Dosing
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Quick_Guide_to_Plugging`}
                      >
                        Rectal Administration (Plugging)
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Reducing_Pain_Caused_by_Insufflation`}
                      >
                        Reducing Snorting Pain
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Cannabinoid_Eliquid`}
                      >
                        Cannabinoid Eliquid
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Cold_Water_Extraction`}
                      >
                        Cold Water Extraction
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wiki.${process.env.NEXT_PUBLIC_DNS_DOMAIN}/wiki/Zim%27s_Clarified_ATB_Hybrid_Salt_Tek`}
                      >
                        Acid-to-base Reduction
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href={`${domain}#cta`}>Volunteer</a>
            </li>
            <li>
              <a href={`${domain}#faq`}>FAQ</a>
            </li>
            <li>
              <a href={`https://updates.${process.env.NEXT_PUBLIC_DNS_DOMAIN}`}>
                Updates
              </a>
            </li>
            <li>
              <a href={`${domain}/appeal`}>Ban Appeal</a>
            </li>
            <li>
              <a
                className="getstarted scrollto"
                href="https://discord.gg/tripsit"
              >
                Join Discord
              </a>
            </li>
            <li>
              <a className="joindiscord scrollto" href={`${domain}/webchat`}>
                Start Webchat
              </a>
            </li>
            <li>
              <div style={{ padding: "0 15px" }}>
                <ProfileButton />
              </div>
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;
