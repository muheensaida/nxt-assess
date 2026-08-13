import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvaluation } from '../../context/EvaluationContext'
import Header from '../Header'
import './index.css'

const Results = () => {
  const navigate = useNavigate()
  const [showReview, setShowReview] = useState(false)

  const {
    isTimeUp, timeTaken, totalQuestions,
    answers, score, questionsList, resetEvaluation,
  } = useEvaluation()

  const answeredCount = Object.keys(answers).length
  const total = questionsList.length > 0 ? questionsList.length : totalQuestions

  const mins = String(Math.floor(timeTaken / 60)).padStart(2, '0')
  const secs = String(timeTaken % 60).padStart(2, '0')

  const handleReattempt = () => {
    resetEvaluation()
    navigate('/assessment', { replace: true })
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="results-main fade-in">
        <div className="results-card glass-card submitted-card">
          <div className="results-blob results-blob-purple" />
          <div className="confetti-container">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{ '--delay': `${i * 0.15}s`, '--x': `${(i * 37) % 100}%` }} />
            ))}
          </div>
          <img
            src={
              isTimeUp
                ? 'https://assets.ccbp.in/frontend/react-js/nxt-assess-time-up-img.png'
                : 'https://assets.ccbp.in/frontend/react-js/nxt-assess-submit-img.png'
            }
            alt="results"
            className="results-img"
          />
          <div className={`results-badge ${isTimeUp ? 'timeup-badge' : 'submit-badge'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {isTimeUp ? "Time's Up!" : 'Assessment Submitted!'}
          </div>
          <h1 className="results-title">{isTimeUp ? 'Assessment Ended' : 'Your Assessment Result'}</h1>
          <p className="results-subtitle">
            {isTimeUp
              ? "The time limit was reached. Here is your final score:"
              : "Great job completing the assessment! Here is your final score:"}
          </p>

          <div className="score-display">
            <div className="score-ring score-ring-green">
              <span className="score-number">{score}</span>
              <span className="score-total">/{total}</span>
            </div>
            <span className="score-label">Score (Correct Answers)</span>
          </div>

          <div className="results-meta">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Time taken: <strong>{mins}:{secs}</strong></span>
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
              </svg>
              <span>Answered: <strong>{answeredCount} of {total}</strong></span>
            </div>
          </div>

          <div className="results-actions-row">
            <button
              className="btn btn-outline review-btn"
              onClick={() => setShowReview(prev => !prev)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {showReview ? 'Hide Review' : 'Review Answers'}
            </button>

            <button className="btn btn-primary results-retry-btn" onClick={handleReattempt}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Reattempt
            </button>
          </div>

          {showReview && questionsList.length > 0 && (
            <div className="review-section">
              <h2 className="review-section-title">Question Review & Correct Answers</h2>
              <div className="review-list">
                {questionsList.map((q, idx) => {
                  const selectedId = answers[q.id]
                  const selectedOpt = q.options.find(o => o.id === selectedId)
                  const correctOpt = q.options.find(o => o.isCorrect === 'true' || o.isCorrect === true || o.is_correct === 'true' || o.is_correct === true)
                  const isCorrect = selectedOpt && (selectedOpt.isCorrect === 'true' || selectedOpt.isCorrect === true || selectedOpt.is_correct === 'true' || selectedOpt.is_correct === true)

                  return (
                    <div
                      key={q.id}
                      className={`review-card ${
                        isCorrect ? 'review-card-correct' : selectedId ? 'review-card-wrong' : 'review-card-skipped'
                      }`}
                    >
                      <div className="review-card-header">
                        <span className="review-q-num">Question {idx + 1}</span>
                        <span className={`review-status-tag ${isCorrect ? 'tag-correct' : selectedId ? 'tag-wrong' : 'tag-skipped'}`}>
                          {isCorrect ? '✓ Correct' : selectedId ? '✗ Incorrect' : '⚠️ Skipped / Unanswered'}
                        </span>
                      </div>
                      <p className="review-q-text">{q.questionText || q.question_text}</p>
                      
                      <div className="review-options-comparison">
                        {q.options.map(opt => {
                          const isUserChoice = opt.id === selectedId
                          const isCorrectChoice = opt.id === correctOpt?.id

                          let optionClass = 'review-opt-item'
                          if (isCorrectChoice) optionClass += ' review-opt-correct'
                          if (isUserChoice && !isCorrectChoice) optionClass += ' review-opt-user-wrong'

                          return (
                            <div key={opt.id} className={optionClass}>
                              <span className="review-opt-text">{opt.text || opt.imageUrl || opt.id}</span>
                              {isUserChoice && <span className="review-badge-user">(Your Answer)</span>}
                              {isCorrectChoice && <span className="review-badge-correct">(Correct Answer)</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Results
