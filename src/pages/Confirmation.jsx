import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Status from '../components/Status'
import { getImageUrl } from '../services/movieApi'
import { formatLongDate, formatRuntime, formatTime } from '../utils/formatDate'
import { formatCurrency } from '../utils/calculatePrice'
import { getBooking } from '../utils/storage'
import { getVerdict } from '../utils/verdict'
import backdropPlaceholder from '../assets/images/backdrop-placeholder.svg'
import posterPlaceholder from '../assets/images/poster-placeholder.svg'

function buildBars(reference) {
  const bars = []
  for (let i = 0; i < 48; i += 1) {
    const code = reference.charCodeAt(i % reference.length) + i * 7
    bars.push(1 + (code % 4))
  }
  return bars
}

function Confirmation() {
  const { reference } = useParams()
  const booking = useMemo(() => getBooking(reference), [reference])
  const bars = useMemo(() => buildBars(reference || 'FF'), [reference])

  if (!booking) {
    return (
      <section className="shell">
        <Status state="empty" title="No such ticket" message={`Nothing under ${reference}.`} />
        <div className="confirm__actions">
          <Link className="button button--primary" to="/">
            Back to the shortlist
          </Link>
        </div>
      </section>
    )
  }

  const seatLabel = booking.seats.length === 1 ? 'Seat' : 'Seats'
  const verdict = getVerdict(booking.rating, booking.movieId)

  return (
    <section className="shell shell--narrow confirm">
      <p className="confirm__stamp">Seats are yours</p>

      <article className="ticket">
        <div className="ticket__top">
          <img
            className="ticket__backdrop"
            src={getImageUrl(booking.backdropPath, 'w780') || backdropPlaceholder}
            alt=""
            onError={(event) => {
              event.currentTarget.src = backdropPlaceholder
            }}
          />
          <div className="ticket__veil" />
          <div className="ticket__headline">
            <img
              className="ticket__poster"
              src={getImageUrl(booking.posterPath, 'w185') || posterPlaceholder}
              alt={booking.title}
              width="76"
              height="114"
              onError={(event) => {
                event.currentTarget.src = posterPlaceholder
              }}
            />
            <div>
              <span className={`stamp stamp--${verdict.type}`}>
                <span className="stamp__emoji" aria-hidden="true">
                  {verdict.emoji}
                </span>
                {verdict.label}
              </span>
              <h1 className="ticket__title">{booking.title}</h1>
              <p className="ticket__runtime">
                {booking.format}
                {booking.runtime ? ` · ${formatRuntime(booking.runtime)}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="ticket__body">
          <dl className="ticket__grid">
            <div>
              <dt>Cinema</dt>
              <dd>{booking.cinema}</dd>
            </div>
            <div>
              <dt>Hall</dt>
              <dd>{booking.hall}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatLongDate(booking.date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{formatTime(booking.time)}</dd>
            </div>
            <div className="ticket__grid-wide">
              <dt>{seatLabel}</dt>
              <dd className="ticket__seats">
                {booking.seats.map((seat) => (
                  <span key={seat}>{seat}</span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>
                {booking.price.counts.standard ? `${booking.price.counts.standard} standard` : ''}
                {booking.price.counts.standard && booking.price.counts.premium ? ', ' : ''}
                {booking.price.counts.premium ? `${booking.price.counts.premium} premium` : ''}
                {booking.isStudent ? ' · student' : ''}
              </dd>
            </div>
            <div>
              <dt>Total paid</dt>
              <dd className="ticket__total">{formatCurrency(booking.price.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="ticket__rip" aria-hidden="true">
          <span className="ticket__notch ticket__notch--left" />
          <span className="ticket__dash" />
          <span className="ticket__notch ticket__notch--right" />
        </div>

        <div className="ticket__stub">
          <div className="ticket__barcode" aria-hidden="true">
            {bars.map((width, index) => (
              <span key={`${width}-${index}`} style={{ width: `${width}px` }} />
            ))}
          </div>
          <p className="ticket__reference">{booking.reference}</p>
          <p className="ticket__address">{booking.address}</p>
        </div>
      </article>

      <div className="confirm__actions">
        <Link className="button button--primary" to={`/book/${booking.movieId}`}>
          Book another
        </Link>
        <Link className="button button--ghost" to="/">
          Done
        </Link>
      </div>
    </section>
  )
}

export default Confirmation
