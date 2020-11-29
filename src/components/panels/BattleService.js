import { ApiService } from '../../ApiService'

export class BattleService {
  static async startBattle() {
    return ApiService.post('game', {}, { expand: 'questions' })
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

  static getBattle() {
    return {
      id: 1,
      questions: [
        {
          id: 1,
          questionWord: 'Car',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
          correctAnswer: 'Машина',
          selectedAnswer: 'Машина',
          isCorrect: true,
        },
        {
          id: 1,
          questionWord: 'Car',
          answerWords: ['Машина', 'Мясо', 'Дверь', 'Город'],
          correctAnswer: 'Машина',
          selectedAnswer: 'Машина',
          isCorrect: false,
        },
      ],
      points: 15,
    }
  }
}
