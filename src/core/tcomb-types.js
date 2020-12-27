import tcomb, { irreducible, refinement } from 'tcomb'

export const Null = irreducible('Null', (value) => value === null)

export const PositiveNumber = refinement(
  tcomb.Number,
  (n) => n >= 0,
  'PositiveNumber'
)

export const ID = refinement(tcomb.Number, (n) => n >= 1, 'ID')
