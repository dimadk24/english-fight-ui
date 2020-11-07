import { battleActions, battleReducer } from './battle-reducer'

describe('battleReducer', () => {
  describe('setQuestions action', () => {
    it('sets passed questions and activeQuestion', () => {
      const initialState = {
        questions: [],
        activeQuestion: null,
        hasNextQuestion: false,
      }
      const action = {
        type: battleActions.setQuestions,
        payload: [{ id: 1 }, { id: 2 }],
      }
      const actual = battleReducer(initialState, action)
      const expected = {
        questions: [{ id: 1 }, { id: 2 }],
        activeQuestion: { id: 1 },
        hasNextQuestion: true,
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('updateQuestion action', () => {
    it('updates questions and activeQuestion', () => {
      const initialState = {
        questions: [
          {
            id: 1,
            questionWord: 'test',
          },
          {
            id: 2,
            questionWord: 'cat',
          },
          {
            id: 3,
            questionWord: 'car',
          },
        ],
        activeQuestion: {
          id: 2,
          questionWord: 'cat',
        },
      }
      const action = {
        type: battleActions.updateQuestion,
        payload: {
          id: 2,
          questionWord: 'dog',
        },
      }
      const actual = battleReducer(initialState, action)
      const expected = {
        questions: [
          {
            id: 1,
            questionWord: 'test',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
          {
            id: 3,
            questionWord: 'car',
          },
        ],
        activeQuestion: {
          id: 2,
          questionWord: 'dog',
        },
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('goToNextQuestion action', () => {
    it('moves activeQuestion to the next question when it will be the last', () => {
      const initialState = {
        questions: [
          {
            id: 1,
            questionWord: 'cat',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
        ],
        activeQuestion: {
          id: 1,
          questionWord: 'cat',
        },
        hasNextQuestion: true,
      }
      const action = {
        type: battleActions.goToNextQuestion,
      }
      const actual = battleReducer(initialState, action)
      const expected = {
        questions: [
          {
            id: 1,
            questionWord: 'cat',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
        ],
        activeQuestion: {
          id: 2,
          questionWord: 'dog',
        },
        hasNextQuestion: false,
      }
      expect(actual).toEqual(expected)
    })

    it('moves activeQuestion to the next when it will not be the last', () => {
      const initialState = {
        questions: [
          {
            id: 1,
            questionWord: 'cat',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
          {
            id: 3,
            questionWord: 'car',
          },
        ],
        activeQuestion: {
          id: 1,
          questionWord: 'cat',
        },
        hasNextQuestion: true,
      }
      const action = {
        type: battleActions.goToNextQuestion,
      }
      const actual = battleReducer(initialState, action)
      const expected = {
        questions: [
          {
            id: 1,
            questionWord: 'cat',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
          {
            id: 3,
            questionWord: 'car',
          },
        ],
        activeQuestion: {
          id: 2,
          questionWord: 'dog',
        },
        hasNextQuestion: true,
      }
      expect(actual).toEqual(expected)
    })

    it('throws error if user is already on the last question', () => {
      const initialState = {
        questions: [
          {
            id: 1,
            questionWord: 'cat',
          },
          {
            id: 2,
            questionWord: 'dog',
          },
        ],
        activeQuestion: {
          id: 2,
          questionWord: 'dog',
        },
      }
      const action = {
        type: battleActions.goToNextQuestion,
      }
      expect(() => battleReducer(initialState, action)).toThrow(
        'You are already on the last question'
      )
    })
  })
})
