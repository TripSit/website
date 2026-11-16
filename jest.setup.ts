import "@testing-library/jest-dom";

// jsdom has no matchMedia. Default to a browser with no preferences; a test can replace
// window.matchMedia to simulate one, such as prefers-reduced-motion.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
