import { createModel } from '../core/model-utils'
import tcomb from 'tcomb'
import { ID, Null } from '../core/tcomb-types'

const attributes = {
  id: ID,
  questionWord: tcomb.String,
  answerWords: tcomb.list(tcomb.String),
  correctAnswer: tcomb.union([Null, tcomb.String]),
  selectedAnswer: tcomb.union([Null, tcomb.String]),
  isCorrect: tcomb.Boolean,
}

export class Question extends createModel(attributes, 'Question') {}
