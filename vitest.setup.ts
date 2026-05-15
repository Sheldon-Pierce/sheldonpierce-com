import "@testing-library/jest-dom/vitest";

// jsdom does not implement window.matchMedia; provide a default stub so tests can
// spy on / mock it. Individual tests override this via vi.spyOn().
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
