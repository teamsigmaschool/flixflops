import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Status from "../components/Status";
import { getImageUrl, getMovieDetails } from "../services/movieApi";
import {
  formatReleaseDate,
  formatRuntime,
  formatShortDate,
  formatTime,
  getUpcomingDates,
} from "../utils/formatDate";
import { getShowtimes } from "../utils/showtimes";
import { getVerdict } from "../utils/verdict";
import posterPlaceholder from "../assets/images/poster-placeholder.svg";
import backdropPlaceholder from "../assets/images/backdrop-placeholder.svg";
import avatarPlaceholder from "../assets/icons/avatar-placeholder.svg";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

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

  const nextSession = useMemo(() => {
    if (!movie) return { date: "", showtimes: [] };
    const dates = getUpcomingDates(7);
    for (const date of dates) {
      const showtimes = getShowtimes(movie.id, date);
      if (showtimes.length) return { date, showtimes: showtimes.slice(0, 5) };
    }
    return { date: dates[0], showtimes: [] };
  }, [movie]);

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

  const poster = getImageUrl(movie.posterPath, "w500") || posterPlaceholder;
  const backdrop =
    getImageUrl(movie.backdropPath, "w1280") || backdropPlaceholder;
  const verdict = getVerdict(movie.rating, movie.id);

  return (
    <article className={`details details--${verdict.type}`}>
      <div className="details__banner">
        <img
          className="details__backdrop"
          src={backdrop}
          alt=""
          onError={(event) => {
            event.currentTarget.src = backdropPlaceholder;
          }}
        />
        <div className="details__veil" />
      </div>

      <div className="shell details__shell">
        <button type="button" className="backlink" onClick={() => navigate(-1)}>
          Back
        </button>

        <div className="details__head">
          <div className="details__postercol">
            <img
              className="details__poster"
              src={poster}
              alt={movie.title}
              width="300"
              height="450"
              onError={(event) => {
                event.currentTarget.src = posterPlaceholder;
              }}
            />
            <span className={`stamp stamp--${verdict.type} stamp--big`}>
              <span className="stamp__emoji" aria-hidden="true">
                {verdict.emoji}
              </span>
              {verdict.label}
            </span>
          </div>

          <div className="details__intro">
            <h1 className="details__title">{movie.title}</h1>
            {movie.tagline ? (
              <p className="details__tagline">{movie.tagline}</p>
            ) : null}

            <div className="scorebar">
              <span className="scorebar__value">
                {movie.rating > 0 ? movie.rating.toFixed(1) : "—"}
              </span>
              <span className="scorebar__track" aria-hidden="true">
                <span
                  className="scorebar__fill"
                  style={{ width: `${movie.rating * 10}%` }}
                />
                <span className="scorebar__mark" />
              </span>
              <span className="scorebar__votes">
                {movie.voteCount.toLocaleString()} votes
              </span>
            </div>

            <ul className="factlist">
              <li>
                <span>Runtime</span>
                <strong>{formatRuntime(movie.runtime) || "—"}</strong>
              </li>
              <li>
                <span>Released</span>
                <strong>{formatReleaseDate(movie.releaseDate)}</strong>
              </li>
              <li>
                <span>Director</span>
                <strong>{movie.director || "—"}</strong>
              </li>
              <li>
                <span>Verdict</span>
                {/* bug 2 whole object passed instead of its value below here */}
                {/* Fixed */}
                <strong>{verdict.label}</strong>
                {/* Broken */}
                {/* <strong>{verdict}</strong> */}
                {/* bug 2 whole object passed instead of its value above here */}
                {verdict.emoji}
              </li>
            </ul>

            {movie.genres.length ? (
              <ul className="tags">
                {movie.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            ) : null}

            <p className="details__overview">
              {movie.overview || "No synopsis on file."}
            </p>

            <Link className="button button--primary" to={`/book/${movie.id}`}>
              Book tickets
            </Link>
          </div>
        </div>

        {movie.cast.length ? (
          <section className="block">
            <h2 className="section__title">Cast</h2>
            <ul className="cast">
              {movie.cast.map((person) => (
                <li key={person.id} className="cast__item">
                  <img
                    className="cast__photo"
                    src={
                      getImageUrl(person.profilePath, "w185") ||
                      avatarPlaceholder
                    }
                    alt={person.name}
                    loading="lazy"
                    width="120"
                    height="120"
                    onError={(event) => {
                      event.currentTarget.src = avatarPlaceholder;
                    }}
                  />
                  <p className="cast__name">{person.name}</p>
                  <p className="cast__role">{person.character}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="block">
          <div className="block__head">
            <h2 className="section__title">Showtimes</h2>
            <p className="block__note">{formatShortDate(nextSession.date)}</p>
          </div>

          {nextSession.showtimes.length ? (
            <div className="timerow">
              {nextSession.showtimes.map((showtime) => (
                <Link
                  key={showtime.id}
                  className="timechip"
                  to={`/book/${movie.id}?date=${nextSession.date}&time=${showtime.time}`}
                >
                  <span className="timechip__time">
                    {formatTime(showtime.time)}
                  </span>
                  <span className="timechip__hall">{showtime.hall}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="block__note">Nothing scheduled.</p>
          )}
        </section>
      </div>
    </article>
  );
}

export default MovieDetails;
