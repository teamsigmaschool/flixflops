import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Seat from "../components/Seat";
import ShowtimeCard from "../components/ShowtimeCard";
import Status from "../components/Status";
import { getImageUrl, getMovieDetails } from "../services/movieApi";
import {
  formatDayName,
  formatDayNumber,
  formatMonthName,
  formatShortDate,
  formatTime,
  getUpcomingDates,
  isWeekendDate,
} from "../utils/formatDate";
import {
  MAX_SEATS_PER_BOOKING,
  STUDENT_DISCOUNT,
  TICKET_PRICES,
  WEEKEND_SURCHARGE,
  calculatePrice,
  formatCurrency,
  getSeatType,
} from "../utils/calculatePrice";
import {
  CINEMA,
  getOccupiedSeats,
  getSeatGrid,
  getShowtimes,
} from "../utils/showtimes";
import { createReference, getBookedSeats, saveBooking } from "../utils/storage";
import { getVerdict } from "../utils/verdict";
import posterPlaceholder from "../assets/images/poster-placeholder.svg";

function compareSeats(a, b) {
  if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
  return Number(a.slice(1)) - Number(b.slice(1));
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dates = useMemo(() => getUpcomingDates(7), []);
  const grid = useMemo(() => getSeatGrid(), []);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [selectedDate, setSelectedDate] = useState(() => {
    const fromUrl = searchParams.get("date");
    return fromUrl && dates.includes(fromUrl) ? fromUrl : dates[0];
  });
  const [selectedTime, setSelectedTime] = useState(() =>
    searchParams.get("time"),
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isStudent, setIsStudent] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    getMovieDetails(id)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, reloadToken]);

  const showtimes = useMemo(
    () => getShowtimes(id, selectedDate),
    [id, selectedDate],
  );

  useEffect(() => {
    const stillValid = showtimes.some((show) => show.time === selectedTime);
    if (!stillValid) {
      setSelectedTime(showtimes.length ? showtimes[0].time : null);
    }
  }, [showtimes, selectedTime]);

  useEffect(() => {
    setSelectedSeats([]);
    setNotice("");
  }, [selectedDate, selectedTime]);

  const occupied = useMemo(() => {
    if (!selectedTime) return new Set();
    return getOccupiedSeats(
      id,
      selectedDate,
      selectedTime,
      getBookedSeats(id, selectedDate, selectedTime),
    );
  }, [id, selectedDate, selectedTime]);

  const activeShow =
    showtimes.find((show) => show.time === selectedTime) || null;
  const verdict = getVerdict(movie?.rating, movie?.id);
  const price = calculatePrice(selectedSeats, {
    date: selectedDate,
    isStudent,
  });
  const orderedSeats = [...selectedSeats].sort(compareSeats);

  const toggleSeat = (seatId) => {
    setNotice("");
    setSelectedSeats((current) => {
      if (current.includes(seatId))
        return current.filter((item) => item !== seatId);
      if (current.length >= 5) {
        setNotice(`8 seats per booking.`);
        return current;
      }
      return [...current, seatId];
    });
  };

  const confirmBooking = () => {
    if (!movie || !activeShow || orderedSeats.length === 0) {
      setNotice("Select at least one seat.");
      return;
    }

    const reference = createReference();
    saveBooking({
      reference,
      movieId: movie.id,
      title: movie.title,
      rating: movie.rating,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath,
      runtime: movie.runtime,
      cinema: CINEMA.name,
      address: CINEMA.address,
      hall: activeShow.hall,
      format: activeShow.format,
      date: selectedDate,
      time: selectedTime,
      seats: orderedSeats,
      isStudent,
      price,
      createdAt: new Date().toISOString(),
    });

    navigate(`/confirmation/${reference}`);
  };

  if (loading) {
    return (
      <section className="shell">
        <Status state="loading" title="Rolling" />
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="shell">
        <Status
          state="error"
          title="Reel missing"
          message={error || "This one never made it to the projector."}
          onRetry={() => setReloadToken((value) => value + 1)}
        />
      </section>
    );
  }

  return (
    <section className="shell booking">
      <button type="button" className="backlink" onClick={() => navigate(-1)}>
        Back
      </button>

      <header className="booking__head">
        <img
          className="booking__poster"
          src={getImageUrl(movie.posterPath, "w185") || posterPlaceholder}
          alt={movie.title}
          width="92"
          height="138"
          onError={(event) => {
            event.currentTarget.src = posterPlaceholder;
          }}
        />
        <div>
          <span className={`stamp stamp--${verdict.type}`}>
            <span className="stamp__emoji" aria-hidden="true">
              {verdict.emoji}
            </span>
            {verdict.label}
          </span>
          <h1 className="booking__title">{movie.title}</h1>
          <p className="booking__sub">
            {CINEMA.name}
            {activeShow ? ` · ${activeShow.hall} · ${activeShow.format}` : ""}
          </p>
        </div>
      </header>

      <div className="booking__layout">
        <div className="booking__main">
          <section className="panel">
            <h2 className="panel__title">
              <span className="panel__step">1</span> Date
            </h2>
            <div className="datestrip">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  className={`datechip${date === selectedDate ? " is-active" : ""}`}
                  onClick={() => setSelectedDate(date)}
                  aria-pressed={date === selectedDate}
                >
                  <span className="datechip__day">{formatDayName(date)}</span>
                  <span className="datechip__number">
                    {formatDayNumber(date)}
                  </span>
                  <span className="datechip__month">
                    {formatMonthName(date)}
                  </span>
                  {isWeekendDate(date) ? (
                    <span className="datechip__flag">+10%</span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">
              <span className="panel__step">2</span> Showtime
            </h2>
            {showtimes.length ? (
              <div className="showtimes">
                {showtimes.map((showtime) => (
                  <ShowtimeCard
                    key={showtime.id}
                    showtime={showtime}
                    selected={showtime.time === selectedTime}
                    onSelect={(next) => setSelectedTime(next.time)}
                  />
                ))}
              </div>
            ) : (
              <p className="panel__note">Nothing left on this date.</p>
            )}
          </section>

          <section className="panel">
            <h2 className="panel__title">
              <span className="panel__step">3</span> Seats
            </h2>

            {activeShow ? (
              <>
                <div className="screen">
                  <div className="screen__bar" />
                  <p className="screen__label">Screen</p>
                </div>

                <div className="seatmap">
                  {grid.map((row) => (
                    <div key={row.row} className="seatrow">
                      <span className="seatrow__label">{row.row}</span>
                      {row.seats.map((seat) => {
                        const state = occupied.has(seat.id)
                          ? "occupied"
                          : selectedSeats.includes(seat.id)
                            ? "selected"
                            : "free";
                        return (
                          <span
                            key={seat.id}
                            className={
                              seat.aisleAfter
                                ? "seatslot has-aisle"
                                : "seatslot"
                            }
                          >
                            <Seat
                              id={seat.id}
                              type={getSeatType(seat.id)}
                              state={state}
                              onToggle={toggleSeat}
                            />
                          </span>
                        );
                      })}
                      <span className="seatrow__label">{row.row}</span>
                    </div>
                  ))}
                </div>

                <ul className="legend">
                  <li>
                    <span className="legend__key seat--standard is-free" />
                    Standard {formatCurrency(TICKET_PRICES.standard)}
                  </li>
                  <li>
                    <span className="legend__key seat--premium is-free" />
                    Premium {formatCurrency(TICKET_PRICES.premium)}
                  </li>
                  <li>
                    <span className="legend__key is-selected" />
                    Selected
                  </li>
                  <li>
                    <span className="legend__key is-occupied" />
                    Taken
                  </li>
                </ul>
              </>
            ) : (
              <p className="panel__note">Pick a showtime first.</p>
            )}
          </section>
        </div>

        <aside className="summary">
          <div className="summary__card">
            <p className="summary__heading">Summary</p>

            <dl className="summary__rows">
              <div>
                <dt>Date</dt>
                <dd>{formatShortDate(selectedDate)}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{selectedTime ? formatTime(selectedTime) : "—"}</dd>
              </div>
              <div>
                <dt>Hall</dt>
                <dd>{activeShow ? activeShow.hall : "—"}</dd>
              </div>
              <div>
                <dt>Seats</dt>
                <dd className="summary__seats">
                  {orderedSeats.length ? orderedSeats.join(", ") : "—"}
                </dd>
              </div>
            </dl>

            <label className="switch">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(event) => setIsStudent(event.target.checked)}
              />
              <span className="switch__track" aria-hidden="true">
                <span className="switch__thumb" />
              </span>
              <span className="switch__text">
                Student <em>-{Math.round(STUDENT_DISCOUNT * 100)}%</em>
              </span>
            </label>

            <dl className="summary__price">
              {price.counts.standard ? (
                <div>
                  <dt>Standard × {price.counts.standard}</dt>
                  <dd>
                    {formatCurrency(
                      price.counts.standard * TICKET_PRICES.standard,
                    )}
                  </dd>
                </div>
              ) : null}
              {price.counts.premium ? (
                <div>
                  <dt>Premium × {price.counts.premium}</dt>
                  <dd>
                    {formatCurrency(
                      price.counts.premium * TICKET_PRICES.premium,
                    )}
                  </dd>
                </div>
              ) : null}
              {price.weekendExtra ? (
                <div>
                  <dt>Weekend +{Math.round(WEEKEND_SURCHARGE * 100)}%</dt>
                  <dd>{formatCurrency(price.weekendExtra)}</dd>
                </div>
              ) : null}
              {price.studentSaving ? (
                <div className="is-saving">
                  <dt>Student</dt>
                  <dd>-{formatCurrency(price.studentSaving)}</dd>
                </div>
              ) : null}
            </dl>

            <div className="summary__total">
              <span>Total</span>
              <strong>{formatCurrency(price.total)}</strong>
            </div>

            {notice ? <p className="summary__notice">{notice}</p> : null}

            <button
              type="button"
              className="button button--primary button--block"
              onClick={confirmBooking}
              disabled={!activeShow || orderedSeats.length === 0}
            >
              Confirm booking
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Booking;
