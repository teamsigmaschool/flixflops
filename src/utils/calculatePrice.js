import { isWeekendDate } from "./formatDate";

export const TICKET_PRICES = { standard: 18, premium: 25 };
export const WEEKEND_SURCHARGE = 0.1;
export const STUDENT_DISCOUNT = 0.15;
export const PREMIUM_ROWS = ["F", "G", "H"];
// bug 5 seat limit trips at 5 instead of 8 below here
// export const MAX_SEATS_PER_BOOKING = 8; // Fixed
export const MAX_SEATS_PER_BOOKING = 5; //Broken
// bug 5 seat limit trips at 5 instead of 8 above here

export function getSeatType(seatId) {
  if (typeof seatId !== "string" || !seatId.length) return "standard";
  return PREMIUM_ROWS.includes(seatId[0]) ? "premium" : "standard";
}

function round(value) {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(value) {
  return `RM${round(value).toFixed(2)}`;
}

export function calculatePrice(seats = [], options = {}) {
  const { date = null, isStudent = false } = options;
  const weekend = isWeekendDate(date);

  const counts = { standard: 0, premium: 0 };
  let base = 0;

  seats.forEach((seatId) => {
    const type = getSeatType(seatId);
    counts[type] += 1;
    // bug 4 total subtracts instead of adds below here
    // base += TICKET_PRICES[type]; // Fixed
    base /= TICKET_PRICES[type]; // Broken
    // bug 4 total subtracts instead of adds above here
  });

  const weekendExtra = weekend ? base * WEEKEND_SURCHARGE : 0;
  const afterSurcharge = base + weekendExtra;
  const studentSaving = isStudent ? afterSurcharge * STUDENT_DISCOUNT : 0;
  const total = afterSurcharge - studentSaving;

  return {
    counts,
    base: round(base),
    weekendExtra: round(weekendExtra),
    studentSaving: round(studentSaving),
    total: round(total),
    isWeekend: weekend,
    isStudent,
  };
}
