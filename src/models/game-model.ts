import { createModel, ModelInstance } from '../core/model-utils'
import tcomb from 'tcomb'
import { Question, QuestionInstance } from './question-model'
import { ID } from '../core/tcomb-types'

const expandableQuestion = tcomb.union([Question, tcomb.Number])
expandableQuestion.dispatch = (x) => {
  if (typeof x === 'number') return tcomb.Number
  return Question
}

const attributes = {
  id: ID,
  questions: tcomb.list(expandableQuestion),
  points: tcomb.Number,
}

export interface GameInstance extends ModelInstance {
  id: number
  questions: QuestionInstance[]
  points: number
}

export class Game extends createModel<GameInstance>(attributes, 'Game') {}
