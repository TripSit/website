import Image from "next/image";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import logo from "../../public/assets/img/logo.png";
import ProfileButton from "./ProfileButton";

function Header() {
  const domain = process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      id="header"
      className="fixed-top d-flex align-items-center bg-dark"
      data-bs-theme="dark"
      style={{ backgroundColor: "#212529" }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        <a href={`https://${domain}`} className="logo">
          <Image src={logo} alt="" className="logoImage" />
        </a>

        <div className="d-flex align-items-center gap-3">
          <div
            className="d-lg-none"
            style={{ display: mobileMenuOpen ? "none" : "block" }}
          >
            <ProfileButton />
          </div>

          <nav
            id="navbar"
            className={`navbar ${mobileMenuOpen ? "navbar-mobile" : ""}`}
          >
            <ul>
              <li>
                <a
                  className="nav-link scrollto active"
                  href={`https://${domain}#hero`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href={`https://${domain}#about`}
                >
                  About
                </a>
              </li>
              <li className="nav-link scrollto dropdown">
                <a href={`https://${domain}#resources`}>
                  <span>Resources</span> <i className="bi bi-chevron-down"></i>
                </a>
                <ul>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
                      <span>Drug Info</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/Main_Page`}>
                          Wiki
                        </a>
                      </li>
                      <li>
                        <a href={`https://${domain}/factsheets`}>Factsheets</a>
                      </li>
                      <li>
                        <a href={`https://combo.${domain}`}>Comboapp</a>
                      </li>
                      <li>
                        <a href={`https://${domain}#faq`}>
                          Printing Information
                        </a>
                      </li>
                      <li>
                        <a href="https://www.reddit.com/r/Drugs/comments/131q1yb/the_drug_users_bible_download_it_free_of_charge/">
                          Drug User&apos;s Handbook
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
                      <span>Calculators</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a href={`https://dxm.${domain}`}>DXM Dosage</a>
                      </li>
                      <li>
                        <a href={`https://volume.${domain}`}>Volumetric</a>
                      </li>
                      <li>
                        <a href={`https://benzos.${domain}`}>
                          Benzo Conversion
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
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
                        <a href="https://ez-test.com.au/">
                          EZ Test (Australia)
                        </a>
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
                    <a href={`https://learn.${domain}`}>Learning Platform</a>
                  </li>
                  <li>
                    <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile&hl=en_US&gl=US">
                      Android App
                    </a>
                  </li>
                  <li>
                    <a href={`https://uptime.${domain}/status/default`}>
                      Service Status
                    </a>
                  </li>
                </ul>
              </li>
              <li className="dropdown">
                <a href={`https://wiki.${domain}/wiki/Category:Guides`}>
                  <span>Guides</span> <i className="bi bi-chevron-down"></i>
                </a>
                <ul>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
                      <span>Harm Reduction</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Common_Misconceptions_About_Psychedelics`}
                        >
                          Psychedelic Myths
                        </a>
                      </li>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/Test_Kits`}>
                          Test Kits
                        </a>
                      </li>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/Scales`}>
                          Scales
                        </a>
                      </li>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/Storage`}>
                          Storage
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Sources_for_Laboratory_Analysis`}
                        >
                          Laboratory Analysis
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
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
                        <a href={`https://wiki.${domain}/wiki/Hallucinogens`}>
                          Hallucinogens
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/How_To_Tripsit_In_Real_Life`}
                        >
                          TripSit in real life
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/How_To_Tripsit_Online`}
                        >
                          TripSit online
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/How_To_Deal_With_A_Bad_Trip`}
                        >
                          Deal with a bad trip
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
                      <span>Recovery</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Quick_Guide_to_Stimulant_Comedowns`}
                        >
                          Stimulant Comedowns
                        </a>
                      </li>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/HPPD`}>HPPD</a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Guide_to_Withdrawals`}
                        >
                          Guide to Withdrawals
                        </a>
                      </li>
                      <li>
                        <a href={`https://wiki.${domain}/wiki/Addiction`}>
                          Addiction
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Professional_Help_Resources`}
                        >
                          Professional Help Resources
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href={`https://${domain}#`}>
                      <span>Dosing</span>{" "}
                      <i className="bi bi-chevron-right"></i>
                    </a>
                    <ul>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Quick_Guide_to_Volumetric_Dosing`}
                        >
                          Volumetric Dosing
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Quick_Guide_to_Plugging`}
                        >
                          Rectal Administration (Plugging)
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Reducing_Pain_Caused_by_Insufflation`}
                        >
                          Reducing Snorting Pain
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Cannabinoid_Eliquid`}
                        >
                          Cannabinoid Eliquid
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Cold_Water_Extraction`}
                        >
                          Cold Water Extraction
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://wiki.${domain}/wiki/Zim%27s_Clarified_ATB_Hybrid_Salt_Tek`}
                        >
                          Acid-to-base Reduction
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <a href={`https://${domain}#cta`}>Volunteer</a>
              </li>
              <li>
                <a href={`https://${domain}#faq`}>FAQ</a>
              </li>
              <li>
                <a href={`https://updates.${domain}`}>Updates</a>
              </li>
              <li>
                <a href={`https://${domain}/appeal`}>Ban Appeal</a>
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
                <a
                  className="joindiscord scrollto"
                  href={`https://${domain}/webchat`}
                >
                  Start Webchat
                </a>
              </li>
              <li className="d-none d-lg-block">
                <div style={{ padding: "0 15px" }}>
                  <ProfileButton />
                </div>
              </li>
            </ul>
            <i
              className={`mobile-nav-toggle ${mobileMenuOpen ? "bi-x" : "bi-list"}`}
              onClick={toggleMobileMenu}
            ></i>
          </nav>
        </div>
      </div>
      <style jsx>{`
        .navbar-mobile .joindiscord,
        .navbar-mobile .joindiscord:focus {
          margin: 15px;
        }
      `}</style>
    </header>
  );
}

export default Header;
