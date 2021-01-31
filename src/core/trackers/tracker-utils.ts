export interface TrackerInterface {
  AUTOMATIC_OPERATIONS: Array<string>
  init: () => Promise<void>
  identify: (id: number, vkId: number) => Promise<void>
  reachGoal: (name: string) => Promise<void>
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type TrackerInput = Optional<TrackerInterface, 'AUTOMATIC_OPERATIONS'>

export const createTracker = (tracker: TrackerInput): TrackerInterface => ({
  AUTOMATIC_OPERATIONS: ['*'],
  ...tracker,
})
