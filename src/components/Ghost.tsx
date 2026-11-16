import { useEffect } from "react";
import { usePrefersReducedMotion } from "../utils/usePrefersReducedMotion";

// After this long without mouse or keyboard activity, the hero text and the animation picker
// fade out (over 5 s) so the background animation can be seen. Any activity brings them back.
const IDLE_MS = 10000;
const FADED_IDS = ["hero", "animationButton"];

function setStyle(opacity: string, transition?: string) {
  for (const id of FADED_IDS) {
    const element = document.getElementById(id);
    if (element) {
      if (transition !== undefined) {
        element.style.transition = transition;
      }
      element.style.opacity = opacity;
    }
  }
}

export default function Ghost() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Never fade the hero for someone who asked for reduced motion. If it already faded
      // before they changed the setting, show it again straight away.
      setStyle("", "");
      return;
    }

    // The timer lives in the effect rather than in state, so activity doesn't re-render the
    // component, and the listeners are added once instead of on every mouse move.
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const handleUserActivity = () => {
      if (idleTimer !== undefined) {
        clearTimeout(idleTimer);
        setStyle("1");
      }
      idleTimer = setTimeout(() => setStyle("0", "opacity 5s"), IDLE_MS);
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      clearTimeout(idleTimer);
    };
  }, [reducedMotion]);

  return <div />;
}
