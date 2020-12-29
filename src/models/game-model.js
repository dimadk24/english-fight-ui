import { createModel } from '../core/model-utils'
import tcomb from 'tcomb'
import { Question } from './question-model'
import { ID } from '../core/tcomb-types'

const expandableQuestion = tcomb.union([Question, tcomb.Number])
expandableQuestion.dispatch = (x) => {
  if (typeof x === 'number') return tcomb.Number
  return Question
}

const props = {
  id: ID,
  questions: tcomb.list(expandableQuestion),
  points: tcomb.Number,
}

export class Game extends createModel(props, 'Game') {}
