import { Link } from "react-router-dom";
import { FLICK_THRESHOLD } from "../utils/verdict";

// bug 3 logo does not go home below here
// const HOME_PATH = "/"; // Fixed
const HOME_PATH = "#"; // Broken
// bug 3 logo does not go home above here

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link
          to={HOME_PATH}
          className="brand"
          aria-label="Flicks and Flops home"
        >
          <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="28" fill="currentColor" />
            <path d="M32 4a28 28 0 0 1 0 56z" fill="#0a0a0a" />
          </svg>
          <span className="brand__name">
            Flicks <em>&amp;</em> Flops
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
