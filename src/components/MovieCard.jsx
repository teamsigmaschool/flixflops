import { Link } from "react-router-dom";
// bug 1 wrong import path below here
import { getImageUrl } from "../services/movieApi"; // Fixed
// import { getImageUrl } from "./movieApi"; // Broken
// bug 1 wrong import path above here
import { formatYear } from "../utils/formatDate";
import { getVerdict } from "../utils/verdict";
import posterPlaceholder from "../assets/images/poster-placeholder.svg";

function MovieCard({ movie }) {
  const poster = getImageUrl(movie.posterPath, "w500") || posterPlaceholder;
  const verdict = getVerdict(movie.rating, movie.id);

  return (
    <Link to={`/movie/${movie.id}`} className="card">
      <div className="card__frame">
        <img
          className="card__poster"
          src={poster}
          alt={movie.title}
          loading="lazy"
          width="300"
          height="450"
          onError={(event) => {
            event.currentTarget.src = posterPlaceholder;
          }}
        />
        <span className={`stamp stamp--${verdict.type}`}>
          <span className="stamp__emoji" aria-hidden="true">
            {verdict.emoji}
          </span>
          {verdict.label}
        </span>
        <span className="card__score">
          {movie.rating > 0 ? movie.rating.toFixed(1) : "—"}
        </span>
        <span className="card__action">Book</span>
      </div>
      <h3 className="card__title">{movie.title}</h3>
      <p className="card__meta">{formatYear(movie.releaseDate)}</p>
    </Link>
  );
}

export default MovieCard;
