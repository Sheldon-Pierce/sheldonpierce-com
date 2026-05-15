import { describe, expect, it } from "vitest";
import { getAllWork, getWorkBySlug } from "./work";

describe("work loader", () => {
  it("loads all work entries sorted with featured first then by year desc", () => {
    const all = getAllWork();
    expect(all.length).toBe(6);
    expect(all[0].featured).toBe(true);
    expect(all[0].slug).toBe("keycloak-theme");
  });

  it("returns a single work entry by slug", () => {
    const entry = getWorkBySlug("handyman-services");
    expect(entry).not.toBeNull();
    expect(entry?.title).toBe("Handyman Services");
  });

  it("returns null for unknown slug", () => {
    expect(getWorkBySlug("does-not-exist")).toBeNull();
  });
});
