export const battleActions = {
  setQuestions: 'setQuestions',
  updateQuestion: 'updateQuestion',
  goToNextQuestion: 'goToNextQuestion',
}

export const initialState = {
  questions: [],
  activeQuestion: null,
  hasNextQuestion: false,
}

export function battleReducer(state = initialState, action) {
  switch (action.type) {
    case battleActions.setQuestions: {
      const questions = action.payload
      return {
        ...state,
        questions,
        activeQuestion: questions[0],
        hasNextQuestion: questions.length > 1,
      }
    }
    case battleActions.updateQuestion: {
      const updatedQuestion = action.payload
      const questionIndex = state.questions.findIndex(
        ({ id }) => id === updatedQuestion.id
      )
      const questions = [
        ...state.questions.slice(0, questionIndex),
        updatedQuestion,
        ...state.questions.slice(questionIndex + 1),
      ]
      return {
        ...state,
        questions,
        activeQuestion: updatedQuestion,
      }
    }
    case battleActions.goToNextQuestion: {
      const activeQuestionIndex = state.questions.findIndex(
        ({ id }) => id === state.activeQuestion.id
      )
      if (activeQuestionIndex === state.questions.length - 1) {
        throw new Error('You are already on the last question')
      }
      const newQuestionIndex = activeQuestionIndex + 1
      return {
        ...state,
        activeQuestion: state.questions[newQuestionIndex],
        hasNextQuestion: newQuestionIndex < state.questions.length - 1,
      }
    }
    default:
      return state
  }
}
