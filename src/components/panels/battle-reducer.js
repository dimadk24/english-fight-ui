export const battleActions = {
  setBattle: 'setBattle',
  updateQuestion: 'updateQuestion',
  goToNextQuestion: 'goToNextQuestion',
}

export const initialState = {
  battle: null,
  activeQuestion: null,
  hasNextQuestion: false,
}

export function battleReducer(state = initialState, action) {
  switch (action.type) {
    case battleActions.setBattle: {
      const battle = action.payload
      const { questions } = battle
      return {
        ...state,
        battle,
        activeQuestion: questions[0],
        hasNextQuestion: questions.length > 1,
      }
    }
    case battleActions.updateQuestion: {
      const updatedQuestion = action.payload
      const currentQuestions = state.battle.questions
      const questionIndex = currentQuestions.findIndex(
        ({ id }) => id === updatedQuestion.id
      )
      const questions = [
        ...currentQuestions.slice(0, questionIndex),
        updatedQuestion,
        ...currentQuestions.slice(questionIndex + 1),
      ]
      return {
        ...state,
        battle: {
          ...state.battle,
          questions,
        },
        activeQuestion: updatedQuestion,
      }
    }
    case battleActions.goToNextQuestion: {
      const currentQuestions = state.battle.questions
      const activeQuestionIndex = currentQuestions.findIndex(
        ({ id }) => id === state.activeQuestion.id
      )
      if (activeQuestionIndex === currentQuestions.length - 1) {
        throw new Error('Вы уже на последнем вопросе')
      }
      const newQuestionIndex = activeQuestionIndex + 1
      return {
        ...state,
        activeQuestion: currentQuestions[newQuestionIndex],
        hasNextQuestion: newQuestionIndex < currentQuestions.length - 1,
      }
    }
    default:
      return state
  }
}
