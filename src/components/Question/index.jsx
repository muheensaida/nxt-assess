import ButtonOptionItem from '../ButtonOptionItem'
import ImageOptionItem from '../ImageOptionItem'
import SelectOption from '../Select'
import './index.css'

const Question = ({ question, selectedOptionId, onSelectOption, isLocked }) => {
  const { questionText, optionsType, options } = question

  const renderOptions = () => {
    switch (optionsType) {
      case 'IMAGE':
        return (
          <div className="options-image-grid">
            {options.map(opt => (
              <ImageOptionItem
                key={opt.id}
                option={opt}
                isSelected={selectedOptionId === opt.id}
                onSelect={() => onSelectOption(opt.id)}
                isLocked={isLocked}
              />
            ))}
          </div>
        )
      case 'SINGLE_SELECT':
        return (
          <SelectOption
            options={options}
            selectedId={selectedOptionId}
            onChange={onSelectOption}
            isLocked={isLocked}
          />
        )
      default: // DEFAULT
        return (
          <div className="options-default-list">
            {options.map((opt, idx) => (
              <ButtonOptionItem
                key={opt.id}
                option={opt}
                index={idx}
                isSelected={selectedOptionId === opt.id}
                onSelect={() => onSelectOption(opt.id)}
                isLocked={isLocked}
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className="question-card glass-card">
      <div className="question-type-badge">
        {optionsType === 'IMAGE' && '🖼️ Image Options'}
        {optionsType === 'SINGLE_SELECT' && '📋 Single Select'}
        {optionsType === 'DEFAULT' && '✅ Multiple Choice'}
        {isLocked && <span className="locked-badge"> 🔒 Answer Locked</span>}
      </div>
      <p className="question-text">{questionText}</p>
      <div className="options-container">
        {renderOptions()}
      </div>
    </div>
  )
}

export default Question
