import { createTracker, TrackerInterface } from './tracker-utils'

const METRIKA_ID = process.env.REACT_APP_METRIKA_ID

export const MetrikaTracker: TrackerInterface = createTracker({
  async init(): Promise<void> {
    /* eslint-disable */
    ;(function(m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function() {
          ;(m[i].a = m[i].a || []).push(arguments)
        }
      // @ts-ignore
      m[i].l = 1 * new Date()
      ;(k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    try {
      // @ts-ignore
      ym(METRIKA_ID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      })
    } catch (e) {
      console.log('Seems like Yandex metrika is blocked')
      console.warn(e)
    }
    /* eslint-enable */
  },

  async identify(id: number, vkId: number): Promise<void> {
    try {
      // @ts-ignore
      window.ym(METRIKA_ID, 'userParams', {
        UserID: id,
        vkId,
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Seems like Yandex metrika is blocked')
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  },

  reachGoal(name: string, params?: Record<string, unknown>): Promise<void> {
    return new Promise((res) => {
      try {
        // @ts-ignore
        window.ym(METRIKA_ID, 'reachGoal', name, params, () => res())
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Seems like Yandex metrika is blocked')
        // eslint-disable-next-line no-console
        console.warn(e)
      }
    })
  },
})
