import Image from "next/image";
import logo from "../../public/assets/img/logo.png";

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
                    <span>Test Kits</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a href="https://dosetest.com/tripsit">
                        DoseTest (Use ‘tripsit’ for 20% off)
                      </a>
                    </li>
                    <li>
                      <a href="https://dancesafe.org/product-category/testing-strips/">
                        Dance Safe
                      </a>
                    </li>
                    <li>
                      <a href="https://www.reagent-tests.uk/shop/">
                        Reagent Tests UK (Use &apos;tripsitwiki&apos; for 10%
                        off)
                      </a>
                    </li>
                    <li>
                      <a href="https://dancesafe.org/testing-kit-instructions/">
                        Test Kit Instructions
                      </a>
                    </li>
                    <li>
                      <a href="https://dancesafe.org/you-may-be-using-fentanyl-testing-strips-incorrectly/">
                        Fentanyl strip guide
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href={`${domain}#`}>
                    <span>Drug</span> <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Main_Page">Wiki</a>
                    </li>
                    <li>
                      <a href="https://drugs.tripsit.me/">Factsheets</a>
                    </li>
                    <li>
                      <a href="https://combo.tripsit.me/">Comboapp</a>
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
                    <span>Chat</span> <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul>
                    <li>
                      <a href="https://discord.gg/tripsit">Join the discord!</a>
                    </li>
                    <li>
                      <a href="https://tripbot.info/dashboard/appeals">
                        Discord Appeals
                      </a>
                    </li>
                    <li>
                      <a href="https://tripbot.info/">TripBot Homepage</a>
                    </li>
                    <li>
                      <a href="https://element.tripsit.me/">Matrix Webchat</a>
                    </li>
                    <li>
                      <a href="https://lounge.tripsit.me">IRC Webchat</a>
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
                      <a href="https://dxm.tripsit.me/">DXM Dosage</a>
                    </li>
                    <li>
                      <a href="https://volume.tripsit.me/">Volumetric</a>
                    </li>
                    <li>
                      <a href="https://benzos.tripsit.me/">Benzo Conversion</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="https://learn.tripsit.me/">Learning Platform</a>
                </li>
                <li>
                  <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile&hl=en_US&gl=US">
                    Android App
                  </a>
                </li>
                <li>
                  <a href="https://uptime.tripsit.me/status/default">
                    Service Status
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="https://wiki.tripsit.me/wiki/Category:Guides">
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
                      <a href="https://wiki.tripsit.me/wiki/Common_Misconceptions_About_Psychedelics">
                        Psychedelic Myths
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Test_Kits">
                        Test Kits
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Scales">Scales</a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Storage">Storage</a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Sources_for_Laboratory_Analysis">
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
                      <a href="https://wiki.tripsit.me/wiki/Hallucinogens">
                        Hallucinogens
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/How_To_Tripsit_In_Real_Life">
                        TripSit in real life
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/How_To_Tripsit_Online">
                        TripSit online
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/How_To_Deal_With_A_Bad_Trip">
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
                      <a href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Stimulant_Comedowns">
                        Stimulant Comedowns
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/HPPD">HPPD</a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Guide_to_Withdrawals">
                        Guide to Withdrawals
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Addiction">
                        Addiction
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Professional_Help_Resources">
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
                      <a href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Volumetric_Dosing">
                        Volumetric Dosing
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Plugging">
                        Rectal Administration (Plugging)
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Reducing_Pain_Caused_by_Insufflation">
                        Reducing Snorting Pain
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Cannabinoid_Eliquid">
                        Cannabinoid Eliquid
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Cold_Water_Extraction">
                        Cold Water Extraction
                      </a>
                    </li>
                    <li>
                      <a href="https://wiki.tripsit.me/wiki/Zim%27s_Clarified_ATB_Hybrid_Salt_Tek">
                        Acid-to-base Reduction
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a className="nav-link scrollto" href={`${domain}#contact`}>
                Contact
              </a>
            </li>
            <li>
              <a href={`${domain}#cta`}>Support</a>
            </li>
            <li>
              <a
                className="nav-link scrollto"
                href="https://updates.tripsit.me"
              >
                Updates
              </a>
            </li>
            <li>
              <a className="getstarted scrollto" href="https://chat.tripsit.me">
                Start Chat
              </a>
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;
