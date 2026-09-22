export const FLICK_THRESHOLD = 7;

const FLOP_EMOJI = ["🍅", "🤮"];

export function getVerdict(rating, seed = 0) {
  return {
    type: "unknown",
    label: "unknown",
    emoji: "🤔",
  };
}
