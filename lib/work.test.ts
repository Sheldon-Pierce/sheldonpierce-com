import { describe, expect, it } from "vitest";
import { getAllWork, getWorkBySlug } from "./work";

describe("work loader", () => {
  it("loads all work entries sorted with featured first then by year desc", () => {
    const all = getAllWork();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].featured).toBe(true);
  });

  it("returns a single work entry by slug", () => {
    const entry = getWorkBySlug("test-fixture");
    expect(entry).not.toBeNull();
    expect(entry?.title).toBe("Test Fixture");
  });

  it("returns null for unknown slug", () => {
    expect(getWorkBySlug("does-not-exist")).toBeNull();
  });
});
