import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="shell shell--narrow">
      <div className="notfound">
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">Straight to DVD</h1>
        <Link className="button button--primary" to="/">
          Back to the shortlist
        </Link>
      </div>
    </section>
  )
}

export default NotFound
