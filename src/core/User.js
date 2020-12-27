import { createModel } from './model-utils'
import tcomb from 'tcomb'

const props = {
  id: tcomb.Number,
  vkId: tcomb.Number,
  //  positive number
  firstName: tcomb.String,
  lastName: tcomb.String,
  photoUrl: tcomb.String,
  score: tcomb.Number,
}

export class User extends createModel(props, 'User') {}
