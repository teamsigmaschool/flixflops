function Seat({ id, type, state, onToggle }) {
  const disabled = state === 'occupied'

  return (
    <button
      type="button"
      className={`seat seat--${type} is-${state}`}
      onClick={() => onToggle(id)}
      disabled={disabled}
      aria-label={`Seat ${id}, ${type}, ${state}`}
      aria-pressed={state === 'selected'}
    >
      {id}
    </button>
  )
}

export default Seat
