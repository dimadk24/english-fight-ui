import mixpanel from 'mixpanel-browser'
import { createTracker, TrackerInterface } from './tracker-utils'
import pickBy from 'lodash.pickby'
import { URLUtils } from '../../URLUtils'

const MIXPANEL_ID = process.env.REACT_APP_MIXPANEL_ID

export const MixpanelTracker: TrackerInterface = createTracker({
  async init() {
    mixpanel.init(MIXPANEL_ID)
  },

  async identify(id: number, vkId: number): Promise<void> {
    const userParams = pickBy(
      {
        'vk id': vkId,
        'utm source': URLUtils.getHashParam('utm_source'),
      },
      (param) => param
    )
    mixpanel.identify(String(id))
    mixpanel.people.set(userParams)
    mixpanel.register(userParams)
  },

  async reachGoal(
    name: string,
    params?: Record<string, unknown>
  ): Promise<void> {
    mixpanel.track(name, params)
  },
})
