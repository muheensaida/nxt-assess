import Timer from '../Timer'
import './index.css'

const AssessmentConfiguration = ({ answeredCount, unansweredCount, timerSeconds }) => (
  <div className="config-container">
    <Timer seconds={timerSeconds} />
    <div className="config-stats">
      <div className="config-stat answered">
        <div className="stat-icon answered-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-count">{answeredCount}</span>
          <span className="stat-label">Answered</span>
        </div>
      </div>
      <div className="config-divider" />
      <div className="config-stat unanswered">
        <div className="stat-icon unanswered-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-count">{unansweredCount}</span>
          <span className="stat-label">Unanswered</span>
        </div>
      </div>
    </div>
  </div>
)

export default AssessmentConfiguration
