import { createModel, ModelInstance } from './model-utils'
import tcomb from 'tcomb'
import { ID, PositiveNumber } from './tcomb-types'
import { NOTIFICATIONS_STATUSES } from '../constants'

const attributes = {
  id: ID,
  vkId: ID,
  firstName: tcomb.String,
  lastName: tcomb.String,
  photoUrl: tcomb.String,
  score: PositiveNumber,
  foreverRank: PositiveNumber,
  monthlyRank: PositiveNumber,
  notificationsStatus: tcomb.enums.of(
    Object.values(NOTIFICATIONS_STATUSES),
    'notificationsStatus'
  ),
}

export interface UserInstance extends ModelInstance {
  id: number
  vkId: number
  firstName: string
  lastName: string
  photoUrl: string
  score: number
  foreverRank: number
  monthlyRank: number
  notificationsStatus: 'allow' | 'block' | 'to be requested'
}

export class User extends createModel<UserInstance>(attributes, 'User') {}
