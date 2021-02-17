export const NOTIFICATIONS_STATUSES = {
  ALLOW: 'allow',
  BLOCK: 'block',
  TO_BE_REQUESTED: 'to be requested',
}

export const GAME_TYPES = {
  WORD: 'word',
  PICTURE: 'picture',
} as const

type GameTypesKeys = keyof typeof GAME_TYPES
export type GameType = typeof GAME_TYPES[GameTypesKeys]

export enum GameModes {
  single = 'single',
  multi = 'multi',
}

export const DELAY_BEFORE_LOADER = 200
