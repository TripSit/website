import { useState, useEffect } from "react";

export default function Ghost() {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUserActivity = () => {
      // console.log("Activity detected!");
      setLastActivity(Date.now());

      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
        const hero = document.getElementById("hero");
        const button = document.getElementById("animationButton");
        if (hero && button) {
          hero.style.opacity = "100";
          button.style.opacity = "100";
        }
      }

      const id = setTimeout(() => {
        if (Date.now() - lastActivity > 10000) {
          // 10 seconds
          // Execute your function here
          // console.log("10 seconds of inactivity detected!");

          // Get element with the id "hero"
          const hero = document.getElementById("hero");
          const button = document.getElementById("animationButton");

          // Gradually set the opacity to 0 over 5 seconds
          if (hero && button) {
            hero.style.transition = "opacity 5s";
            button.style.transition = "opacity 5s";
            hero.style.opacity = "0";
            button.style.opacity = "0";
          }
        }
      }, 10000); // Check inactivity after 10 seconds

      setTimeoutId(id);
    };

    // Attaching event listeners
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    // ... you can add more event listeners if required

    // Returning cleanup function to remove event listeners
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastActivity, timeoutId]);

  return <div>{/* Your component content here */}</div>;
}
