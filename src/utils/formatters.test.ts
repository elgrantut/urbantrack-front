import { describe, expect, it } from "vitest";

import { formatCapacity, formatDateTime, formatRelativeTime, truncate } from "./formatters";

// ── formatCapacity ────────────────────────────────────────────────────────────

describe("formatCapacity", () => {
  it("appends ' kg' and adds thousands separator", () => {
    expect(formatCapacity(5000)).toBe("5,000 kg");
    expect(formatCapacity(1000)).toBe("1,000 kg");
    expect(formatCapacity(500)).toBe("500 kg");
  });

  it("handles zero", () => {
    expect(formatCapacity(0)).toBe("0 kg");
  });

  it("handles large values", () => {
    expect(formatCapacity(1_000_000)).toBe("1,000,000 kg");
  });
});

// ── truncate ──────────────────────────────────────────────────────────────────

describe("truncate", () => {
  it("returns the original string when within the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
    expect(truncate("exactly", 7)).toBe("exactly");
  });

  it("appends an ellipsis when the string exceeds the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("handles an empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});

// ── formatRelativeTime ────────────────────────────────────────────────────────

describe("formatRelativeTime", () => {
  it('returns "just now" for timestamps less than 60 seconds ago', () => {
    const thirtySecsAgo = new Date(Date.now() - 30 * 1000);
    expect(formatRelativeTime(thirtySecsAgo)).toBe("just now");
  });

  it('returns "1 minute ago" for exactly 1 minute', () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago");
  });

  it('returns plural "minutes ago" for multiple minutes', () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinsAgo)).toBe("5 minutes ago");
  });

  it('returns "1 hour ago" for exactly 1 hour', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago");
  });

  it('returns plural "hours ago" for multiple hours', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeHoursAgo)).toBe("3 hours ago");
  });

  it('returns "1 day ago" for exactly 1 day', () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(oneDayAgo)).toBe("1 day ago");
  });

  it('returns plural "days ago" for multiple days', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoDaysAgo)).toBe("2 days ago");
  });

  it("accepts an ISO string as input", () => {
    const iso = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatRelativeTime(iso)).toBe("just now");
  });

  it("falls back to a locale date string for dates older than 30 days", () => {
    const oldDate = new Date("2020-01-15");
    const result = formatRelativeTime(oldDate);
    // Should be a locale string, not a relative string
    expect(result).not.toMatch(/ago/);
    expect(result).toMatch(/2020/);
  });
});

// ── formatDateTime ────────────────────────────────────────────────────────────

describe("formatDateTime", () => {
  it("formats a Date object as a readable date/time string", () => {
    // Use a fixed date to avoid locale-sensitivity issues
    const date = new Date("2026-01-15T15:42:00");
    const result = formatDateTime(date);
    // Should contain the year and month
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
  });

  it("accepts an ISO string as input", () => {
    const result = formatDateTime("2026-01-15T15:42:00");
    expect(result).toMatch(/2026/);
  });
});
