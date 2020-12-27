import { ApiService } from '../../core/ApiService'
import { Game } from '../../models/Game'
import { Question } from '../../models/Question'

export class BattleService {
  static async startBattle() {
    const response = await ApiService.post('game', {}, { expand: 'questions' })
    return Game.fromObject(response)
  }

  static async submitQuestion(question) {
    const response = await ApiService.patch(`question/${question.id}`, {
      selectedAnswer: question.selectedAnswer,
    })
    return Question.fromObject(response)
  }

  static async getBattle(id) {
    const result = await ApiService.get(`game/${id}`, { expand: 'questions' })
    return Game.fromObject(result)
  }
}
