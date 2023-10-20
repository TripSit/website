import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState } from "react";
import queryString from "@/utils/queryString";
// import axios from "axios";
// import { type Users, type Appeals } from "../types/database.d";

const appealAccordionClassNames = {
  base: "appealAccBase",
  heading: "appealAccHeading",
  trigger: "appealAccTrigger",
  titleWrapper: "appealAccWrapper",
  title: "appealAccTitle",
  subtitle: "appealAccSubtitle",
  startContent: "appealAccContent",
  indicator: "appealAccIndicator",
  content: "appealAccContent",
};

export default function Appeal() {
  // const [user, setUser] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ifAuthenticated, setIfAuthenticated] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateParam, setStateParam] = useState("");
  // const [oAuthUrl, setOAuthUrl] = useState("");
  console.log(
    `GetOauthURL - DISCORD_CLIENT_ID: ${process.env.DISCORD_CLIENT_ID}`,
  );

  const loginParams = {
    client_id: process.env.DISCORD_CLIENT_ID as string,
    redirect_uri: `https://${process.env.DNS_DOMAIN}/#appeal`,
    response_type: "token",
    scope: "identify",
    state: stateParam as string,
  };

  const oAuthUrl = `https://discord.com/api/oauth2/authorize${queryString(
    loginParams,
  )}`;

  console.log(`oAuthUrl: ${oAuthUrl}`);

  return (
    <section id="appeal" className="appeal">
      <div className="container" data-aos="fade-up">
        <div className="row content">
          <div className="col-lg-12">
            <Accordion>
              <AccordionItem
                key="0"
                aria-label="I would like to appeal my ban"
                title="I would like to appeal my ban"
                classNames={appealAccordionClassNames}
              >
                {ifAuthenticated ? (
                  <div>Fuck yeah, lets keep going.</div>
                ) : (
                  <div className="container mt-5">
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          At TripSit, we believe in second chances.
                        </p>
                        <p className="card-text">
                          If you feel you&apos;ve grown and addressed the issues
                          that resulted in your ban, we&apos;re open to
                          reconsidering.
                        </p>
                        <p className="card-text">
                          To appeal your ban, you will need a TripSit account
                          linked to the service you want to be unbanned from.
                        </p>
                        <p className="card-text">
                          For a majority of people: Go ahead and make a new
                          tripsit account below by logging in with your Discord
                          account. If you already have a TripSit account and
                          need to link to Discord, click New Account and login
                          with your Discord account.
                        </p>
                        <p className="card-text">
                          Remember to revisit this page to check the status of
                          your appeal in the future.
                        </p>
                        <a href={oAuthUrl} className="btn btn-primary">
                          Login to Discord
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
