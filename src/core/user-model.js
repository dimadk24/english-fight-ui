import { createModel } from './model-utils'
import tcomb from 'tcomb'
import { ID, PositiveNumber } from './tcomb-types'

const props = {
  id: ID,
  vkId: ID,
  firstName: tcomb.String,
  lastName: tcomb.String,
  photoUrl: tcomb.String,
  score: PositiveNumber,
}

export class User extends createModel(props, 'User') {}
