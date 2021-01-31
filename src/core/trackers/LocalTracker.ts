/* eslint-disable no-console */
import { TrackerInterface } from './TrackerInterface'

export const LocalTracker: TrackerInterface = {
  async init(): Promise<void> {
    console.log('Init tracker')
  },

  async identify(id: number, vkId: number): Promise<void> {
    console.log(`linked session with userId ${id}, vkId ${vkId}`)
  },

  async reachGoal(name: string): Promise<void> {
    console.log(`Reach goal ${name}`)
  },
}
