import QuestionNumberItem from '../QuestionNumberItem'
import './index.css'

const QuestionPalette = ({ questions, activeIdx, answers, onSelect }) => (
  <div className="palette-container">
    <div className="palette-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      Question Navigator
    </div>
    <div className="palette-grid" data-testid="questionPalette">
      {questions.map((q, idx) => (
        <QuestionNumberItem
          key={q.id}
          number={idx + 1}
          isActive={activeIdx === idx}
          isAnswered={!!answers[q.id]}
          onClick={() => onSelect(idx)}
        />
      ))}
    </div>
    <div className="palette-legend">
      <div className="legend-item">
        <div className="legend-dot answered-dot" />
        <span>Answered</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot unanswered-dot" />
        <span>Not Answered</span>
      </div>
      <div className="legend-item">
        <div className="legend-dot active-dot" />
        <span>Active</span>
      </div>
    </div>
  </div>
)

export default QuestionPalette
