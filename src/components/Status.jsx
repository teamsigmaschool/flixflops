function Status({ state = 'loading', title, message, onRetry }) {
  return (
    <div className={`status status--${state}`} role={state === 'error' ? 'alert' : 'status'}>
      {state === 'loading' ? <span className="status__reel" aria-hidden="true" /> : null}
      <p className="status__title">{title}</p>
      {message ? <p className="status__message">{message}</p> : null}
      {onRetry ? (
        <button type="button" className="button button--ghost" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}

export default Status
