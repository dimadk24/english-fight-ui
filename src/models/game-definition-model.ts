import { createModel, ModelInstance } from '../core/model-utils'
import tcomb from 'tcomb'
import { ID } from '../core/tcomb-types'

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
  type: string
}

export class GameDefinition extends createModel<GameDefinitionInstance>(
  attributes,
  'GameDefinition'
) {}
