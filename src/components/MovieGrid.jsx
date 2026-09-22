import MovieCard from './MovieCard'

function MovieGrid({ movies }) {
  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid
