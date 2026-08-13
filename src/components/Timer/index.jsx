import './index.css'

const Timer = ({ seconds }) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const isLow = seconds < 60
  const isCritical = seconds < 30

  return (
    <div className={`timer-container ${isLow ? 'timer-low' : ''} ${isCritical ? 'timer-critical' : ''}`}>
      <div className="timer-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Time Remaining
      </div>
      <div className="timer-display">
        <span className="timer-digits">{mins}</span>
        <span className="timer-colon">:</span>
        <span className="timer-digits">{secs}</span>
      </div>
      <div className="timer-progress">
        <div
          className="timer-progress-fill"
          style={{ width: `${(seconds / 600) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default Timer
