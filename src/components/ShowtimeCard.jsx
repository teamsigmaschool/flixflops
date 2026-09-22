import { formatTime } from '../utils/formatDate'

function ShowtimeCard({ showtime, selected = false, onSelect }) {
  const almostFull = showtime.seatsLeft < 25

  return (
    <button
      type="button"
      className={`showtime${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect(showtime)}
      aria-pressed={selected}
    >
      <span className="showtime__time">{formatTime(showtime.time)}</span>
      <span className="showtime__hall">
        {showtime.hall} · {showtime.format}
      </span>
      <span className={`showtime__seats${almostFull ? ' is-low' : ''}`}>
        {showtime.seatsLeft} left
      </span>
    </button>
  )
}

export default ShowtimeCard
