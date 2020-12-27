import { ApiService } from '../../core/ApiService'
import { Game } from '../../models/Game'
import { Question } from '../../models/Question'

export class BattleService {
  static async startBattle() {
    return ApiService.post('game', {}, { expand: 'questions', Model: Game })
  }

  static async submitQuestion(question) {
    return ApiService.patch(
      `question/${question.id}`,
      {
        selectedAnswer: question.selectedAnswer,
      },
      { Model: Question }
    )
  }

  static async getBattle(id) {
    return ApiService.get(`game/${id}`, { expand: 'questions', Model: Game })
  }
}
