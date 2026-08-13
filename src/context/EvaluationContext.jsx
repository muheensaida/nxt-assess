import React, { createContext, useContext, useState, useCallback } from 'react'

const EvaluationContext = createContext()

export const EvaluationProvider = ({ children }) => {
  const [answers, setAnswers] = useState({})
  const [lockedQuestions, setLockedQuestions] = useState({})
  const [questionsList, setQuestionsList] = useState([])
  const [timeTaken, setTimeTaken] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const selectAnswer = useCallback((questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }, [])

  const clearAnswer = useCallback((questionId) => {
    setAnswers(prev => {
      const nextAnswers = { ...prev }
      delete nextAnswers[questionId]
      return nextAnswers
    })
  }, [])

  const lockQuestion = useCallback((questionId) => {
    setLockedQuestions(prev => ({ ...prev, [questionId]: true }))
  }, [])

  // Bulk restore saved answers and locked states (for resume feature)
  const restoreAnswers = useCallback((savedAnswers, savedLocked) => {
    setAnswers(savedAnswers || {})
    setLockedQuestions(savedLocked || {})
  }, [])

  const resetEvaluation = useCallback(() => {
    setAnswers({})
    setLockedQuestions({})
    setTimeTaken(0)
    setIsTimeUp(false)
  }, [])

  const getScore = useCallback(() => {
    if (!questionsList || questionsList.length === 0) return 0
    return questionsList.filter(q => {
      const selectedId = answers[q.id]
      if (!selectedId) return false
      const opt = q.options.find(o => o.id === selectedId)
      return opt && (opt.isCorrect === 'true' || opt.isCorrect === true || opt.is_correct === 'true' || opt.is_correct === true)
    }).length
  }, [answers, questionsList])

  const score = getScore()

  return (
    <EvaluationContext.Provider
      value={{
        answers,
        lockedQuestions,
        questionsList,
        setQuestionsList,
        timeTaken,
        setTimeTaken,
        isTimeUp,
        setIsTimeUp,
        totalQuestions,
        setTotalQuestions,
        selectAnswer,
        clearAnswer,
        lockQuestion,
        restoreAnswers,
        resetEvaluation,
        getScore,
        score,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export const useEvaluation = () => useContext(EvaluationContext)
export default EvaluationContext
