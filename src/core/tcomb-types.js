import tcomb from 'tcomb'

export const Null = tcomb.irreducible('Null', (value) => value === null)
