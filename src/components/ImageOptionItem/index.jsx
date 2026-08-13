import './index.css'

const ImageOptionItem = ({ option, isSelected, onSelect, isLocked }) => (
  <button
    className={`img-option-btn ${isSelected ? 'img-option-selected' : ''} ${isLocked ? 'img-option-locked' : ''}`}
    onClick={isLocked ? undefined : onSelect}
    disabled={isLocked}
    type="button"
  >
    <div className="img-option-frame">
      <img
        src={option.imageUrl}
        alt={option.text}
        className="img-option-img"
      />
      {isSelected && (
        <div className="img-option-overlay">
          <div className="img-check-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
      )}
    </div>
    <span className="img-option-label">{option.text}</span>
  </button>
)

export default ImageOptionItem
