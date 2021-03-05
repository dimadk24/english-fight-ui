import { createModel, ModelInstance } from '../core/model-utils'
import tcomb from 'tcomb'
import { ID } from '../core/tcomb-types'
import { GameType } from '../constants'

const attributes = {
  id: tcomb.String,
  creator: ID,
  players: tcomb.list(ID),
  type: tcomb.String,
}

export interface GameDefinitionInstance extends ModelInstance {
  id: string
  creator: number
  players: number[]
  type: GameType
}

export class GameDefinition extends createModel<GameDefinitionInstance>(
  attributes,
  'GameDefinition'
) {}
