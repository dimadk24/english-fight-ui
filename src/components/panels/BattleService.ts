import { ApiService } from '../../core/ApiService'
import { Game, GameInstance } from '../../models/game-model'
import { Question, QuestionInstance } from '../../models/question-model'
import { GameDefinitionInstance } from '../../models/game-definition-model'
import { GameType } from '../../constants'

export class BattleService {
  static async startSinglePlayerGame(
    gameType: GameType
  ): Promise<GameInstance> {
    const gameDefinition = await ApiService.post<GameDefinitionInstance>(
      'game_definition',
      {
        type: gameType,
      }
    )
    return ApiService.post<GameInstance>(
      'game',
      { gameDefinition: gameDefinition.id },
      { expand: 'questions', Model: Game }
    )
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
