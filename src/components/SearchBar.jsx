function SearchBar({ value, onChange, placeholder = 'Search titles' }) {
  return (
    <div className="search">
      <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        className="search__input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label="Search movies"
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button type="button" className="search__clear" onClick={() => onChange('')}>
          Clear
        </button>
      ) : null}
    </div>
  )
}

export default SearchBar
