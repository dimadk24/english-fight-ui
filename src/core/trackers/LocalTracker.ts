/* eslint-disable no-console */
import { createTracker, TrackerInterface } from './tracker-utils'

export const LocalTracker: TrackerInterface = createTracker({
  async init(): Promise<void> {
    console.log('Init tracker')
  },

  async identify(id: number, vkId: number): Promise<void> {
    console.log(`linked session with userId ${id}, vkId ${vkId}`)
  },

  async reachGoal(
    name: string,
    params?: Record<string, unknown>
  ): Promise<void> {
    console.log(`Reach goal ${name} with params`, params)
  },
})
