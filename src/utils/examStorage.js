const STORAGE_KEY = 'nxt_assess_exam_progress'

export const saveExamState = (state) => {
  try {
    const dataToSave = {
      answers: state.answers || {},
      lockedQuestions: state.lockedQuestions || {},
      activeIdx: state.activeIdx ?? state.currentQuestionIndex ?? 0,
      timerSeconds: state.timerSeconds ?? 600,
      savedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.error('Failed to save exam state:', error)
  }
}

export const getExamState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    return JSON.parse(saved)
  } catch (error) {
    console.error('Failed to parse exam state:', error)
    return null
  }
}

export const clearExamState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear exam state:', error)
  }
}

export const hasSavedExam = () => {
  const state = getExamState()
  return Boolean(state && state.answers)
}
