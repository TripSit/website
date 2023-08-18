function Footer() {
  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 footer-contact">
              <h3>TripSit</h3>
            </div>

            <div className="col-lg-2 col-md-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right"></i> <a href="#">Home</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://tripsit.me/about/">About us</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://wiki.tripsit.me/wiki/Terms_of_Service">
                    Terms of service
                  </a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://wiki.tripsit.me/wiki/Privacy_Policy">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://home.tripsit.me/">Team Portal</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://combo.tripsit.me/">Combo App</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://drugs.tripsit.me/">Factsheets</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://chat.tripsit.me">Live Chat</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://play.google.com/store/apps/details?id=me.tripsit.mobile">
                    Android App
                  </a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <a href="https://learn.tripsit.me/">Learning Portal</a>
                </li>
              </ul>
            </div>

            {/* <div className="col-lg-4 col-md-6 footer-newsletter">
              <h4>Join Our Newsletter</h4>
              <p>Want to stay up to date with new information?</p>
              <form action="" method="post">
                <input type="email" name="email" />{" "}
                <input type="submit" value="Subscribe" />
              </form>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container d-md-flex py-4">
        <div className="me-md-auto text-center text-md-start">
          <div className="copyright">
            &copy; Copyright{" "}
            <strong>
              <span>TripSit</span>
            </strong>
            . All Rights Reserved
          </div>
          <div className="credits">
            Made with ❤️ by <a href="https://github.com/LunaUrsa">Moonbear</a>{" "}
            and Team TripSit
          </div>
        </div>
        <div className="social-links text-center text-md-right pt-3 pt-md-0">
          <a href="https://discord.gg/tripsit" className="discord">
            <i className="bx bxl-discord"></i>
          </a>
          <a href="https://twitter.com/teamtripsit" className="twitter">
            <i className="bx bxl-twitter"></i>
          </a>
          <a href="https://www.facebook.com/TripSitme" className="facebook">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="http://reddit.com/r/TripSit" className="reddit">
            <i className="bx bxl-reddit"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/tripsit"
            className="linkedin"
          >
            <i className="bx bxl-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
