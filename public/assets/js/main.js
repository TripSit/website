/**
 * Template Name: OnePage
 * Updated: Jul 27 2023 with Bootstrap v5.3.1
 * Template URL: https://bootstrapmade.com/onepage-multipurpose-bootstrap-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

const mobileNavbar = "navbar-mobile";

document.addEventListener("DOMContentLoaded", function onLoad() {
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    const trim = el.trim();
    if (all) {
      return [...document.querySelectorAll(trim)];
    }
    return document.querySelector(trim);
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  const navbarLinks = select("#navbar .scrollto", true);
  const navbarLinksActive = () => {
    const position = window.scrollY + 200;
    navbarLinks.forEach((navbarLink) => {
      if (!navbarLink.hash) return;
      const section = select(navbarLink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarLink.classList.add("active");
      } else {
        navbarLink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarLinksActive);
  onscroll(document, navbarLinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const header = select("#header");
    const offset = header.offsetHeight;

    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  const selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  const backToTop = select(".back-to-top");
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 100) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBackToTop);
    onscroll(document, toggleBackToTop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function toggleList() {
    select("#navbar").classList.toggle(mobileNavbar);
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function toggleDropdown(e) {
      if (select("#navbar").classList.contains(mobileNavbar)) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true,
  );

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function scrollTo(e) {
      if (select(this.hash)) {
        e.preventDefault();

        const navbar = select("#navbar");
        if (navbar.classList.contains(mobileNavbar)) {
          navbar.classList.remove(mobileNavbar);
          const navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true,
  );

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /**
   * Preloader
   */
  const preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }
  // /**
  //  * Initiate glightbox
  //  */
  // const glightbox = GLightbox({
  //   selector: ".glightbox",
  // });

  // /**
  //  * Testimonials slider
  //  */
  // new Swiper(".testimonials-slider", {
  //   speed: 600,
  //   loop: true,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: false,
  //   },
  //   slidesPerView: "auto",
  //   pagination: {
  //     el: ".swiper-pagination",
  //     type: "bullets",
  //     clickable: true,
  //   },
  //   breakpoints: {
  //     320: {
  //       slidesPerView: 1,
  //       spaceBetween: 20,
  //     },

  //     1200: {
  //       slidesPerView: 3,
  //       spaceBetween: 20,
  //     },
  //   },
  // });

  // /**
  //  * Portfolio isotope and filter
  //  */
  // window.addEventListener("load", () => {
  //   const portfolioContainer = select(".portfolio-container");
  //   if (portfolioContainer) {
  //     const portfolioIsotope = new Isotope(portfolioContainer, {
  //       itemSelector: ".portfolio-item",
  //     });

  //     const portfolioFilters = select("#portfolio-filters li", true);

  //     on(
  //       "click",
  //       "#portfolio-filters li",
  //       function (e) {
  //         e.preventDefault();
  //         portfolioFilters.forEach(function (el) {
  //           el.classList.remove("filter-active");
  //         });
  //         this.classList.add("filter-active");

  //         portfolioIsotope.arrange({
  //           filter: this.getAttribute("data-filter"),
  //         });
  //         portfolioIsotope.on("arrangeComplete", function () {
  //           AOS.refresh();
  //         });
  //       },
  //       true,
  //     );
  //   }
  // });

  //   /**
  //    * Initiate portfolio lightbox
  //    */
  //   const portfolioLightbox = GLightbox({
  //     selector: ".portfolio-lightbox",
  //   });

  //   /**
  //    * Portfolio details slider
  //    */
  //   new Swiper(".portfolio-details-slider", {
  //     speed: 400,
  //     loop: true,
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: false,
  //     },
  //     pagination: {
  //       el: ".swiper-pagination",
  //       type: "bullets",
  //       clickable: true,
  //     },
  //   });
});
