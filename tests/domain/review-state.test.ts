import { describe, expect, it } from "vitest";
import { isReviewState, REVIEW_STATES } from "../../src/domain/review-state.js";

describe("review state primitive", () => {
  it("includes suspended and contested as first-class states", () => {
    expect(REVIEW_STATES).toEqual([
      "accepted",
      "rejected",
      "suspended",
      "contested"
    ]);
  });

  it("recognizes valid review states", () => {
    expect(isReviewState("accepted")).toBe(true);
    expect(isReviewState("rejected")).toBe(true);
    expect(isReviewState("suspended")).toBe(true);
    expect(isReviewState("contested")).toBe(true);
  });

  it("rejects unknown states", () => {
    expect(isReviewState("resolved")).toBe(false);
    expect(isReviewState("pending")).toBe(false);
  });
});
