import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid'
import SearchBar from '../components/SearchBar'
import Status from '../components/Status'
import { getImageUrl, getPopularMovies, searchMovies } from '../services/movieApi'
import { formatYear } from '../utils/formatDate'
import { getVerdict } from '../utils/verdict'
import backdropPlaceholder from '../assets/images/backdrop-placeholder.svg'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'flick', label: 'Flicks 🍿' },
  { id: 'flop', label: 'Flops 🍅' }
]

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [input, setInput] = useState(query)
  const [filter, setFilter] = useState('all')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const trimmed = input.trim()
    if (trimmed === query) return undefined

    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (trimmed) next.set('q', trimmed)
      else next.delete('q')
      setSearchParams(next, { replace: true })
    }, 350)

    return () => clearTimeout(timer)
  }, [input, query, searchParams, setSearchParams])

  const fetchPage = useCallback(
    (nextPage) => (query ? searchMovies(query, nextPage) : getPopularMovies(nextPage)),
    [query]
  )

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    fetchPage(1)
      .then((data) => {
        if (ignore) return
        setMovies(data.results)
        setPage(data.page)
        setTotalPages(data.totalPages)
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [fetchPage, reloadToken])

  const loadMore = () => {
    setLoadingMore(true)
    fetchPage(page + 1)
      .then((data) => {
        setMovies((current) => {
          const seen = new Set(current.map((movie) => movie.id))
          return [...current, ...data.results.filter((movie) => !seen.has(movie.id))]
        })
        setPage(data.page)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoadingMore(false))
  }

  const visible = useMemo(() => {
    if (filter === 'all') return movies
    return movies.filter((movie) => getVerdict(movie.rating, movie.id).type === filter)
  }, [movies, filter])

  const featured = useMemo(
    () => movies.find((movie) => movie.backdropPath && movie.overview) || null,
    [movies]
  )

  const featuredVerdict = featured ? getVerdict(featured.rating, featured.id) : null
  const showHero = !query && featured

  return (
    <>
      {showHero ? (
        <section className={`hero hero--${featuredVerdict.type}`}>
          <img
            className="hero__image"
            src={getImageUrl(featured.backdropPath, 'w1280') || backdropPlaceholder}
            alt=""
            onError={(event) => {
              event.currentTarget.src = backdropPlaceholder
            }}
          />
          <div className="hero__veil" />
          <div className="hero__body">
            <p className="verdictline">
              <span className="verdictline__emoji" aria-hidden="true">
                {featuredVerdict.emoji}
              </span>
              {featuredVerdict.label}
              <span className="verdictline__score">
                {featured.rating > 0 ? featured.rating.toFixed(1) : '—'}
              </span>
            </p>
            <h1 className="hero__title">{featured.title}</h1>
            <p className="hero__overview">{featured.overview}</p>
            <div className="hero__actions">
              <Link className="button button--primary" to={`/book/${featured.id}`}>
                Book tickets
              </Link>
              <Link className="button button--ghost" to={`/movie/${featured.id}`}>
                {formatYear(featured.releaseDate)} · Details
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell">
        <div className="listing__bar">
          <h2 className="section__title">{query ? `“${query}”` : 'The shortlist'}</h2>
          <div className="listing__tools">
            <div className="segmented" role="group" aria-label="Verdict filter">
              {FILTERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={filter === option.id ? 'is-active' : ''}
                  aria-pressed={filter === option.id}
                  onClick={() => setFilter(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <SearchBar value={input} onChange={setInput} />
          </div>
        </div>

        {loading ? <Status state="loading" title="Rolling" /> : null}

        {!loading && error ? (
          <Status
            state="error"
            title="Projector jammed"
            message={error}
            onRetry={() => setReloadToken((value) => value + 1)}
          />
        ) : null}

        {!loading && !error && visible.length === 0 ? (
          <Status
            state="empty"
            title="Empty house"
            message={query ? `Nothing matches “${query}”.` : 'Nothing in this pile yet.'}
          />
        ) : null}

        {!loading && !error && visible.length > 0 ? <MovieGrid movies={visible} /> : null}

        {!loading && !error && page < totalPages ? (
          <div className="listing__more">
            <button
              type="button"
              className="button button--ghost"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading' : 'More'}
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}

export default Home
