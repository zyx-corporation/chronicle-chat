export const REVIEW_STATES = [
  "accepted",
  "rejected",
  "suspended",
  "contested"
] as const;

export type ReviewState = (typeof REVIEW_STATES)[number];

export function isReviewState(value: string): value is ReviewState {
  return REVIEW_STATES.includes(value as ReviewState);
}
