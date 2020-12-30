import { ApiService } from '../../core/ApiService'
import { Game, GameInstance } from '../../models/game-model'
import { Question, QuestionInstance } from '../../models/question-model'

export class BattleService {
  static async startBattle(): Promise<GameInstance> {
    return ApiService.post('game', {}, { expand: 'questions', Model: Game })
  }

  static async submitQuestion(
    question: QuestionInstance
  ): Promise<QuestionInstance> {
    return ApiService.patch(
      `question/${question.id}`,
      {
        selectedAnswer: question.selectedAnswer,
      },
      { Model: Question }
    )
  }

  static async getBattle(id: number): Promise<GameInstance> {
    return ApiService.get(`game/${id}`, { expand: 'questions', Model: Game })
  }
}
