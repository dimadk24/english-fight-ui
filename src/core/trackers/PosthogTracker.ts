import posthog from 'posthog-js'
import { timeout } from 'promise-timeout'
import { TrackerInterface } from './TrackerInterface'

let initPromise = null

async function waitForInit(): Promise<void> {
  if (initPromise === null) {
    throw new Error('Tracker was not initialized')
  }
  await initPromise
}

export const PosthogTracker: TrackerInterface = {
  init(): Promise<void> {
    initPromise = new Promise<void>((res) => {
      posthog.init(process.env.REACT_APP_POSTHOG_ID, {
        autocapture: false,
        loaded: () => res(),
      })
    })
    return timeout<void>(initPromise, 10000)
  },

  async identify(id: number, vkId: number): Promise<void> {
    await waitForInit()
    posthog.identify(String(id))
    posthog.people.set({ vkId })
  },

  async reachGoal(name: string): Promise<void> {
    await waitForInit()
    posthog.capture(name)
  },
}
