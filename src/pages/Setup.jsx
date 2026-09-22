function Setup() {
  return (
    <div className="setup">
      <div className="setup__card">
        <p className="setup__brand">Flicks &amp; Flops</p>
        <h1 className="setup__title">Add a TMDB key</h1>
        <ol className="setup__steps">
          <li>
            Create a free account at{' '}
            <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer">
              themoviedb.org
            </a>
          </li>
          <li>
            Copy your key from{' '}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
              Settings &rarr; API
            </a>
          </li>
          <li>
            Paste it into <code>.env</code>, then restart the dev server
          </li>
        </ol>
        <pre className="setup__code">VITE_TMDB_API_KEY=your_key_here</pre>
      </div>
    </div>
  )
}

export default Setup
