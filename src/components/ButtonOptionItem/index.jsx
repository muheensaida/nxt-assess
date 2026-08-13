import './index.css'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const ButtonOptionItem = ({ option, index, isSelected, onSelect, isLocked }) => (
  <button
    className={`option-btn ${isSelected ? 'option-btn-selected' : ''} ${isLocked ? 'option-btn-locked' : ''}`}
    onClick={isLocked ? undefined : onSelect}
    disabled={isLocked}
    type="button"
  >
    <span className={`option-letter ${isSelected ? 'option-letter-selected' : ''}`}>
      {LETTERS[index] || index + 1}
    </span>
    <span className="option-text">{option.text}</span>
    {isSelected && (
      <span className="option-check-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
    )}
  </button>
)

export default ButtonOptionItem
