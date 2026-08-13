import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header'
import AssessmentConfiguration from '../AssessmentConfiguration'
import Question from '../Question'
import QuestionPalette from '../QuestionPalette'
import { useEvaluation } from '../../context/EvaluationContext'
import { saveExamState, getExamState, clearExamState } from '../../utils/examStorage'
import './index.css'

const TIMER_LIMIT = 600 // 10 minutes in seconds

const apiStatusTypes = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

const Assessment = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusTypes.INITIAL)
  const [questions, setQuestions] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(TIMER_LIMIT)
  const [saveToast, setSaveToast] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const navigate = useNavigate()

  const {
    answers, lockedQuestions, selectAnswer, clearAnswer, lockQuestion,
    restoreAnswers, setTimeTaken, setIsTimeUp, resetEvaluation,
    setTotalQuestions, setQuestionsList,
  } = useEvaluation()

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setApiStatus(apiStatusTypes.LOADING)
    try {
      const token = localStorage.getItem('jwt_token')
      const res = await fetch('/ccbp-api/assess/questions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()

      const formatted = data.questions.map(q => ({
        id: q.id,
        questionText: q.question_text,
        optionsType: q.options_type,
        options: q.options.map(o => ({
          id: o.id,
          text: o.text,
          imageUrl: o.image_url,
          isCorrect: o.is_correct,
        })),
      }))
      setQuestions(formatted)
      setQuestionsList(formatted)
      setTotalQuestions(formatted.length)

      // Restore saved progress if available (Resume exam feature)
      const savedState = getExamState()
      if (savedState) {
        if (savedState.answers) restoreAnswers(savedState.answers, savedState.lockedQuestions)
        if (typeof savedState.activeIdx === 'number') setActiveIdx(savedState.activeIdx)
        if (typeof savedState.timerSeconds === 'number' && savedState.timerSeconds > 0) {
          setTimerSeconds(savedState.timerSeconds)
        }
      }

      setApiStatus(apiStatusTypes.SUCCESS)
    } catch {
      setApiStatus(apiStatusTypes.FAILURE)
    }
  }, [restoreAnswers, setTotalQuestions, setQuestionsList])

  useEffect(() => {
    fetchQuestions()
  }, []) // eslint-disable-line

  // Warning when tab is exited during assessment
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (apiStatus === apiStatusTypes.SUCCESS) {
        event.preventDefault()
        event.returnValue = 'Assessment in progress. Are you sure you want to exit?'
        return event.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [apiStatus])

  // Save exam progress to localStorage on change
  useEffect(() => {
    if (apiStatus === apiStatusTypes.SUCCESS) {
      saveExamState({ answers, lockedQuestions, activeIdx, timerSeconds })
    }
  }, [answers, lockedQuestions, activeIdx, timerSeconds, apiStatus])

  // Countdown timer
  useEffect(() => {
    if (apiStatus !== apiStatusTypes.SUCCESS) return
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          clearExamState()
          setIsTimeUp(true)
          setTimeTaken(TIMER_LIMIT)
          navigate('/results', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [apiStatus]) // eslint-disable-line

  const handleSubmit = () => {
    clearExamState()
    setTimeTaken(TIMER_LIMIT - timerSeconds)
    setIsTimeUp(false)
    navigate('/results', { replace: true })
  }

  const handleSaveQuestion = () => {
    if (!activeQuestion) return
    if (answers[activeQuestion.id]) {
      lockQuestion(activeQuestion.id)
      saveExamState({
        answers,
        lockedQuestions: { ...lockedQuestions, [activeQuestion.id]: true },
        activeIdx,
        timerSeconds,
      })
      setSaveToast(true)
      setTimeout(() => setSaveToast(false), 2000)
    }
  }

  const handleNextQuestion = () => {
    if (!activeQuestion) return
    if (answers[activeQuestion.id]) {
      lockQuestion(activeQuestion.id)
    }

    // Find next unanswered question starting after activeIdx
    const nextUnansweredIdx = questions.findIndex(
      (q, idx) => idx > activeIdx && !answers[q.id]
    )

    if (nextUnansweredIdx !== -1) {
      setActiveIdx(nextUnansweredIdx)
    } else {
      // If no unanswered questions ahead, check if there are unanswered questions before activeIdx
      const prevUnansweredIdx = questions.findIndex(
        (q, idx) => idx < activeIdx && !answers[q.id]
      )
      if (prevUnansweredIdx !== -1) {
        setActiveIdx(prevUnansweredIdx)
      } else if (activeIdx < questions.length - 1) {
        // If all questions answered, move sequentially
        setActiveIdx(i => i + 1)
      }
    }
  }

  const handleSkipQuestion = () => {
    if (!activeQuestion) return
    if (!lockedQuestions[activeQuestion.id]) {
      clearAnswer(activeQuestion.id)
    }
    if (activeIdx < questions.length - 1) {
      setActiveIdx(i => i + 1)
    }
  }

  const answeredCount = Object.keys(answers).filter(
    id => questions.find(q => q.id === id)
  ).length
  const unansweredCount = questions.length - answeredCount

  // Render states
  if (apiStatus === apiStatusTypes.LOADING) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loader-container" data-testid="loader">
          <div className="loader" />
        </div>
      </div>
    )
  }

  if (apiStatus === apiStatusTypes.FAILURE) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="failure-view fade-in">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-assess-failure-img.png"
            alt="failure view"
            className="failure-img"
            onError={e => { e.target.src = 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Error' }}
          />
          <h2 className="failure-title">Oops! Something Went Wrong</h2>
          <p className="failure-msg">We couldn't load the questions. Please try again.</p>
          <button className="btn btn-primary" onClick={fetchQuestions}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (apiStatus !== apiStatusTypes.SUCCESS) return null

  const activeQuestion = questions[activeIdx]
  const isCurrentLocked = Boolean(lockedQuestions[activeQuestion?.id])
  const hasAnswer = Boolean(answers[activeQuestion?.id])
  const isLastQuestion = activeIdx === questions.length - 1

  return (
    <div className="page-wrapper">
      <Header />
      <main className="assessment-main fade-in">
        <div className="assessment-layout">
          {/* Sidebar */}
          <aside className="assessment-sidebar glass-card">
            <AssessmentConfiguration
              answeredCount={answeredCount}
              unansweredCount={unansweredCount}
              timerSeconds={timerSeconds}
            />
            <QuestionPalette
              questions={questions}
              activeIdx={activeIdx}
              answers={answers}
              onSelect={setActiveIdx}
            />
          </aside>

          {/* Main question area */}
          <section className="assessment-question-area">
            <div className="question-header">
              <span className="question-counter">
                Question {activeIdx + 1} of {questions.length}
              </span>
              <div className="question-progress-bar">
                <div
                  className="question-progress-fill"
                  style={{ width: `${((activeIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {saveToast && (
              <div className="save-toast">
                🔒 Answer Saved & Locked
              </div>
            )}

            <Question
              question={activeQuestion}
              selectedOptionId={answers[activeQuestion.id]}
              onSelectOption={optionId => !isCurrentLocked && selectAnswer(activeQuestion.id, optionId)}
              isLocked={isCurrentLocked}
            />

            <div className="question-option-controls">
              <button
                type="button"
                className={`btn ${isCurrentLocked ? 'btn-disabled' : 'btn-secondary'} save-btn`}
                onClick={handleSaveQuestion}
                disabled={isCurrentLocked || !hasAnswer}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {isCurrentLocked ? 'Answer Locked' : 'Save'}
              </button>

              {!isCurrentLocked && (
                <button
                  type="button"
                  className="btn btn-outline clear-btn"
                  onClick={() => clearAnswer(activeQuestion.id)}
                  disabled={!hasAnswer}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Clear
                </button>
              )}
            </div>

            <div className="assessment-actions">
              {!isLastQuestion && (
                <button
                  type="button"
                  className="btn btn-warning skip-btn"
                  onClick={handleSkipQuestion}
                >
                  Skip
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="13 17 18 12 13 7"/>
                    <polyline points="6 17 11 12 6 7"/>
                  </svg>
                </button>
              )}

              {!isLastQuestion ? (
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                >
                  Next Question
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={() => setShowSubmitModal(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Submit Assessment
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Are you sure you want to submit dialogue box modal */}
      {showSubmitModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-card">
            <div className="modal-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 className="modal-title">Are you sure you want to submit the exam?</h2>
            <p className="modal-subtitle">
              Here is the summary of your answered and unanswered questions:
            </p>

            <div className="modal-summary-grid">
              <div className="modal-summary-item total">
                <span className="summary-count">{questions.length}</span>
                <span className="summary-label">Total Questions</span>
              </div>
              <div className="modal-summary-item answered">
                <span className="summary-count">{answeredCount}</span>
                <span className="summary-label">Answered</span>
              </div>
              <div className="modal-summary-item unanswered">
                <span className="summary-count">{unansweredCount}</span>
                <span className="summary-label">Unanswered / Skipped</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="modal-warning-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>You have {unansweredCount} unanswered / skipped question(s).</span>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowSubmitModal(false)}
              >
                Continue Exam
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Assessment
