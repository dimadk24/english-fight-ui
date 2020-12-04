import { ApiService } from '../../ApiService'

export class BattleService {
  static async startBattle() {
    return ApiService.post('game', {}, { expand: 'questions' })
  }

  static async submitQuestion(question) {
    return ApiService.patch(`question/${question.id}`, {
      selectedAnswer: question.selectedAnswer,
    })
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
