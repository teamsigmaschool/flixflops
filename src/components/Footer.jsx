import { CINEMA } from '../utils/showtimes'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__name">Flicks &amp; Flops</p>
          <p className="footer__address">{CINEMA.address}</p>
        </div>
        <p className="footer__joke">No refunds on flops.</p>
        <p className="footer__credit">
          Ratings from{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . Not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  )
}

export default Footer
