import "@testing-library/jest-dom";

// ── Radix UI polyfills ────────────────────────────────────────────────────────
// jsdom does not implement pointer capture APIs used by Radix primitives.
HTMLElement.prototype.hasPointerCapture = vi.fn();
HTMLElement.prototype.setPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();

// jsdom does not implement scrollIntoView (used by Select to scroll to the
// selected item in the list).
HTMLElement.prototype.scrollIntoView = vi.fn();

// ResizeObserver is not available in jsdom but is used by some Radix internals.
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});
