const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key) {
  if (typeof key !== "string") return null;
  const parts = key.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getUpcomingDates(count = 7) {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < count; i += 1) {
    const day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ++i,
    );
    dates.push(toDateKey(day));
  }
  return dates;
}

export function isWeekendDate(key) {
  const date = parseDateKey(key);
  if (!date) return false;
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function formatDayName(key) {
  const date = parseDateKey(key);
  return date ? DAYS_SHORT[date.getDay()] : "";
}

export function formatDayNumber(key) {
  const date = parseDateKey(key);
  return date ? String(date.getDate()).padStart(2, "0") : "";
}

export function formatMonthName(key) {
  const date = parseDateKey(key);
  return date ? MONTHS_SHORT[date.getMonth()] : "";
}

export function formatShortDate(key) {
  const date = parseDateKey(key);
  if (!date) return "";
  return `${DAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function formatLongDate(key) {
  const date = parseDateKey(key);
  if (!date) return "";
  return `${DAYS_LONG[date.getDay()]}, ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatReleaseDate(value) {
  if (!value) return "Unannounced";
  const date = parseDateKey(value);
  if (!date) return "Unannounced";
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatYear(value) {
  const date = parseDateKey(value);
  return date ? String(date.getFullYear()) : "";
}

export function formatTime(time) {
  if (typeof time !== "string" || !time.includes(":")) return "";
  const [hourPart, minutePart] = time.split(":");
  const hour = Number(hourPart);
  if (Number.isNaN(hour)) return "";
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minutePart} ${suffix}`;
}

export function formatRuntime(minutes) {
  if (!minutes || minutes < 1) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  if (!rest) return `${hours}h`;
  return `${hours}h ${rest}m`;
}
