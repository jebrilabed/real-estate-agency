import { describe, it, expect } from "vitest";
import { commission, isPublic } from "@/lib/marketplace";
describe("Marketplace rules", () => {
  it("hides new pending listings", () =>
    expect(isPublic({ approval: "pending", status: "available" })).toBe(false));
  it("shows only approved available listings", () => {
    expect(isPublic({ approval: "approved", status: "available" })).toBe(true);
    expect(isPublic({ approval: "approved", status: "sold" })).toBe(false);
    expect(isPublic({ approval: "rejected", status: "available" })).toBe(false);
  });
  it("calculates percentage commission on final transaction value", () =>
    expect(commission(200000, "percentage", 2)).toBe(4000));
  it("keeps a fixed commission independent of transaction price", () =>
    expect(commission(200000, "fixed", 1500)).toBe(1500));
  it("rejects percentages above 100", () =>
    expect(() => commission(1000, "percentage", 101)).toThrow());
});
