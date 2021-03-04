import posthog from 'posthog-js'
import { timeout } from 'promise-timeout'
import { createTracker, TrackerInterface } from './tracker-utils'
import { URLUtils } from '../../URLUtils'

const POSTHOG_ID = process.env.REACT_APP_POSTHOG_ID

let initPromise: Promise<void> | null = null

async function waitForInit(): Promise<void> {
  if (initPromise === null) {
    throw new Error('Tracker was not initialized')
  }
  await initPromise
}

export const PosthogTracker: TrackerInterface = createTracker({
  init(): Promise<void> {
    initPromise = new Promise<void>((res) => {
      posthog.init(POSTHOG_ID, {
        autocapture: false,
        loaded: () => res(),
      })
    })
    return timeout<void>(initPromise, 10000)
  },

  async identify(id: number, vkId: number): Promise<void> {
    await waitForInit()
    const userParams = {
      vkId,
      'utm source': URLUtils.getHashParam('utm_source') || '',
    }
    posthog.identify(String(id))
    posthog.people.set_once(userParams)
    posthog.register_once(userParams)
  },

  async reachGoal(
    name: string,
    params?: Record<string, unknown>
  ): Promise<void> {
    await waitForInit()
    posthog.capture(name, params)
  },
})
