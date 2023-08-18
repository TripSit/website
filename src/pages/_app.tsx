import { AppProps } from "next/app";
import { useEffect } from "react";
import AOS from "aos";
// Vendor CSS Files
import "../../public/assets/vendor/aos/aos.css";
import "../../public/assets/vendor/bootstrap/css/bootstrap.min.css";
import "../../public/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../public/assets/vendor/boxicons/css/boxicons.min.css";
import "../../public/assets/vendor/glightbox/css/glightbox.min.css";
import "../../public/assets/vendor/swiper/swiper-bundle.min.css";
import "../../public/assets/vendor/remixicon/remixicon.css";
// Main CSS file
import "../../public/assets/css/style.css";
import dynamic from "next/dynamic";
import { TypeProp } from "particles-bg";

// Dynamically import ParticlesBg with SSR turned off
const ParticlesBg = dynamic(() => import("particles-bg"), {
  ssr: false,
});

// const colorConfig = {
//   num: [100, 100], // Defaults, but can be overridden by this.props.num
//   rps: 0.1, // Assumption based on new Proton.Span(0.1, 0.25)
//   radius: [20, 200],
//   life: [2, 4],
//   position: "all", // Based on the Proton.Position initialization
//   alpha: [0, 1],
//   scale: [1, 0],
//   g: 100,
//   color: "this.colors", // Placeholder; you'd replace this with the actual colors array when using the config
//   ease: "easeOutCubic", // Assumption based on Proton.easeOutCubic
//   // Any other properties based on behaviors or initializations not provided would go here
// };

const particleEffects = [
  // { type: "lines" }, // Small trailers
  // { type: "thick" }, // Large trails
  // { type: "cobweb", color: "#FFFFFF" }, // Must set color to white
  // { type: "tadpole" },
  // { type: "circle" },
  // { type: "color" }, // Needs to be slowed down before we can use
  // { type: "ball" }, // Slow down
  // { type: "polygon" }, // Slow down
  // { type: "square" }, // Slow down
  // { type: "fountain" }, // Slow down
  { type: "random" },
] as {
  type: TypeProp;
  color: string;
  num: number;
}[];

function getRandomEffect() {
  const randomIndex = Math.floor(Math.random() * particleEffects.length);
  return particleEffects[randomIndex];
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const effect = getRandomEffect();

  return (
    <>
      <Component {...pageProps} />
      <ParticlesBg {...effect} bg={true} />
    </>
  );
}
