import { createModel, ModelInstance } from './model-utils'
import tcomb from 'tcomb'
import { ID, PositiveNumber } from './tcomb-types'

const attributes = {
  id: ID,
  vkId: ID,
  firstName: tcomb.String,
  lastName: tcomb.String,
  photoUrl: tcomb.String,
  score: PositiveNumber,
}

export interface UserInstance extends ModelInstance {
  id: number
  vkId: number
  firstName: string
  lastName: string
  photoUrl: string
  score: number
}

export class User extends createModel<UserInstance>(attributes, 'User') {}
