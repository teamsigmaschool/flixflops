export const FLICK_THRESHOLD = 7;

const FLOP_EMOJI = ["🍅", "🤮"];

export function getVerdict(rating, seed = 0) {
  if (!rating || rating <= 0) {
    return { type: "unrated", label: "Unrated", emoji: "🤷" };
  }
  if (rating > FLICK_THRESHOLD) {
    return { type: "flick", label: "Flick", emoji: "🍿" };
  }
  return {
    type: "flop",
    label: "Flop",
    emoji: FLOP_EMOJI[Math.abs(Math.trunc(seed)) % FLOP_EMOJI.length],
  };
}
