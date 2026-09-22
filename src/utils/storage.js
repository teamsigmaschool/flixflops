const STORAGE_KEY = 'panggung.bookings.v1'
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(bookings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    return true
  } catch {
    return false
  }
}

export function createReference() {
  let reference = ''
  for (let i = 0; i < 6; i += 1) {
    reference += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)]
  }
  return `FF-${reference}`
}

export function loadBookings() {
  return readStore()
}

export function saveBooking(booking) {
  const bookings = readStore()
  bookings.push(booking)
  writeStore(bookings)
  return booking
}

export function getBooking(reference) {
  if (!reference) return null
  return readStore().find((booking) => booking.reference === reference) || null
}

export function getBookedSeats(movieId, dateKey, time) {
  return readStore()
    .filter(
      (booking) =>
        String(booking.movieId) === String(movieId) &&
        booking.date === dateKey &&
        booking.time === time
    )
    .flatMap((booking) => booking.seats || [])
}
