import mixpanel from 'mixpanel-browser'
import { createTracker, TrackerInterface } from './tracker-utils'
import { URLUtils } from '../../URLUtils'

const MIXPANEL_ID = process.env.REACT_APP_MIXPANEL_ID

export const MixpanelTracker: TrackerInterface = createTracker({
  async init() {
    mixpanel.init(MIXPANEL_ID)
  },

  async identify(id: number, vkId: number): Promise<void> {
    const userParams = {
      'vk id': vkId,
      'utm source': URLUtils.getHashParam('utm_source') || '',
    }
    mixpanel.identify(String(id))
    mixpanel.people.set_once(userParams)
    mixpanel.register_once(userParams)
  },

  async reachGoal(
    name: string,
    params?: Record<string, unknown>
  ): Promise<void> {
    mixpanel.track(name, params)
  },
})
