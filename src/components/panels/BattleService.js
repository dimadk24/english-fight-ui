import { ApiService } from '../../core/ApiService'

export class BattleService {
  static async startBattle() {
    return ApiService.post('game', {}, { expand: 'questions' })
  }

  static async submitQuestion(question) {
    return ApiService.patch(`question/${question.id}`, {
      selectedAnswer: question.selectedAnswer,
    })
  }

  static getBattle(id) {
    return ApiService.get(`game/${id}`, { expand: 'questions' })
  }
}
