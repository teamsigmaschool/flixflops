export const CINEMA = {
  name: 'Flicks & Flops',
  address: 'Level 4, Jalan Bukit Bintang, Kuala Lumpur'
}

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const SEATS_PER_ROW = 12
export const AISLE_AFTER = [3, 9]

const TIME_SLOTS = ['10:30', '13:15', '16:00', '18:45', '21:30', '23:15']
const HALLS = ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5']
const FORMATS = ['2D', 'IMAX', 'Dolby Atmos', '2D', 'IMAX']

function hashString(value) {
  let hash = 2166136261
  const text = String(value)
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed) {
  let state = seed >>> 0
  return function next() {
    state += 0x6d2b79f5
    let result = state
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

export function getSeatGrid() {
  return ROWS.map((row) => ({
    row,
    seats: Array.from({ length: SEATS_PER_ROW }, (unused, index) => ({
      id: `${row}${index + 1}`,
      column: index + 1,
      aisleAfter: AISLE_AFTER.includes(index + 1)
    }))
  }))
}

export function getAllSeatIds() {
  return getSeatGrid().flatMap((row) => row.seats.map((seat) => seat.id))
}

function minutesSinceMidnight(time) {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

export function getShowtimes(movieId, dateKey) {
  if (!movieId || !dateKey) return []
  const random = createRandom(hashString(`${movieId}:${dateKey}`))
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const nowMinutes = today.getHours() * 60 + today.getMinutes()

  return TIME_SLOTS.map((time, index) => {
    const hallIndex = Math.floor(random() * HALLS.length)
    const seatsLeft = 12 + Math.floor(random() * 60)
    return {
      id: `${dateKey}-${time}`,
      time,
      hall: HALLS[hallIndex],
      format: FORMATS[hallIndex],
      seatsLeft,
      slot: index
    }
  }).filter((show) => {
    if (dateKey !== todayKey) return true
    return minutesSinceMidnight(show.time) > nowMinutes + 20
  })
}

export function getOccupiedSeats(movieId, dateKey, time, bookedSeats = []) {
  if (!movieId || !dateKey || !time) return new Set(bookedSeats)
  const random = createRandom(hashString(`${movieId}|${dateKey}|${time}`))
  const slotIndex = TIME_SLOTS.indexOf(time)
  const density = 0.16 + slotIndex * 0.045

  const occupied = new Set(bookedSeats)
  getAllSeatIds().forEach((seatId) => {
    if (random() < density) occupied.add(seatId)
  })
  return occupied
}
