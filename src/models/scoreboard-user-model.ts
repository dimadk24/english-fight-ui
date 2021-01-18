import tcomb from 'tcomb'
import { ID, PositiveNumber } from '../core/tcomb-types'
import { createModel, ModelInstance } from '../core/model-utils'

const attributes = {
  id: ID,
  firstName: tcomb.String,
  lastName: tcomb.String,
  photoUrl: tcomb.String,
  score: PositiveNumber,
}

export interface ScoreboardUserInstance extends ModelInstance {
  id: number
  firstName: string
  lastName: string
  photoUrl: string
  score: number
}

export class ScoreboardUser extends createModel<ScoreboardUserInstance>(
  attributes,
  'ScoreboardUser'
) {}
