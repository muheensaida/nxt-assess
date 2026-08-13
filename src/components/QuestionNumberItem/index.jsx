import './index.css'

const QuestionNumberItem = ({ number, isActive, isAnswered, onClick }) => {
  let className = 'q-number-btn'
  if (isActive) className += ' q-active'
  else if (isAnswered) className += ' q-answered'

  return (
    <button
      data-testid="questionItem"
      className={className}
      onClick={onClick}
      aria-label={`Question ${number}`}
      aria-current={isActive ? 'true' : undefined}
    >
      {number}
      {isAnswered && !isActive && (
        <span className="q-check">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      )}
    </button>
  )
}

export default QuestionNumberItem
