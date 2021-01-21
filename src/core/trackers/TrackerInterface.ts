export interface TrackerInterface {
  init: () => Promise<void>
  identify: (id: number, vkId: number) => Promise<void>
  reachGoal: (name: string) => Promise<void>
}
