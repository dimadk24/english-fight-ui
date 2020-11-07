import { ApiService } from '../../ApiService'

export class BattleService {
  static async startBattle() {
    return {
      id: 1,
      questions: [
        {
          id: 1,
          questionWord: 'Car',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
        },
        {
          id: 2,
          questionWord: 'Town',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
        },
        {
          id: 3,
          questionWord: 'Door',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
        },
        {
          id: 4,
          questionWord: 'Meat',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
        },
        {
          id: 5,
          questionWord: 'Car',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
        },
      ],
    }
    // eslint-disable-next-line no-unreachable
    return ApiService.post('game')
  }

  // eslint-disable-next-line no-unused-vars
  static async submitQuestion(question) {
    return {
      id: question.id,
      questionWord: 'Car',
      answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
      correctAnswer: 'Машина',
      selectedAnswer: question.selectedAnswer,
      isCorrect: question.selectedAnswer === 'Машина',
    }
    // await Utils.waitForTimeout(100)
  }
}
