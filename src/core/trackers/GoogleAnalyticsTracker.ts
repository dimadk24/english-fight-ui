import { createTracker, TrackerInterface } from './tracker-utils'
import pickBy from 'lodash.pickby'
import { URLUtils } from '../../URLUtils'
import { timeout } from 'promise-timeout'

const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID

let initPromise: Promise<void> | null = null

async function waitForInit(): Promise<void> {
  if (initPromise === null) {
    throw new Error('Tracker was not initialized')
  }
  await initPromise
}

export const GoogleAnalyticsTracker: TrackerInterface = createTracker({
  init(): Promise<void> {
    const script = document.createElement('script')
    script.setAttribute('async', '1')
    script.setAttribute(
      'src',
      `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`
    )
    document.body.append(script)
    /* eslint-disable */
    ;(() => {
      // @ts-ignore
      window.dataLayer = window.dataLayer || []
      function gtag() {
        // @ts-ignore
        dataLayer.push(arguments)
      }
      // @ts-ignore
      window.gtag = gtag
      // @ts-ignore
      gtag('js', new Date())

      // @ts-ignore
      gtag('config', GOOGLE_ANALYTICS_ID)
    })()
    /* eslint-enable */
    /* eslint-disable no-console */
    initPromise = new Promise((res) => {
      script.addEventListener('load', () => res())
    })
    return timeout<void>(initPromise, 10000)
  },

  async identify(id: number, vkId: number): Promise<void> {
    await waitForInit()
    const userParams = pickBy(
      {
        'utm source': URLUtils.getHashParam('utm_source'),
      },
      (param) => param
    )
    try {
      // @ts-ignore
      gtag('set', 'user_properties', {
        id,
        'vk id': vkId,
        ...userParams,
      })
    } catch (e) {
      console.log('Seems like Google analytics is blocked')
      console.warn(e)
    }
  },
  async reachGoal(
    name: string,
    params?: Record<string, unknown>
  ): Promise<void> {
    await waitForInit()

    try {
      // @ts-ignore
      gtag('event', name, params)
    } catch (e) {
      console.log('Seems like Google analytics is blocked')
      console.warn(e)
    }
  },
})
