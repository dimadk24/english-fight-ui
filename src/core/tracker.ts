/* eslint-disable class-methods-use-this, no-console */
// eslint-disable-next-line max-classes-per-file
import { Utils } from '../Utils'

interface TrackerInterface {
  init: () => void
  reachGoal: (name: string) => Promise<void>
}

class LocalTracker implements TrackerInterface {
  init() {
    console.log('Init tracker')
  }

  async reachGoal(name) {
    console.log(`Reach goal ${name}`)
  }
}

class MetrikaTracker implements TrackerInterface {
  init(): void {
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
      ym(70656700, 'init', {
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
  }

  // eslint-disable-next-line class-methods-use-this
  reachGoal(name: string): Promise<void> {
    return new Promise((res) => {
      try {
        // @ts-ignore
        window.ym(70656700, 'reachGoal', name, () => res())
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Seems like Yandex metrika is blocked')
        // eslint-disable-next-line no-console
        console.warn(e)
      }
    })
  }
}

const TrackerClass = Utils.isProductionMode ? MetrikaTracker : LocalTracker

const tracker = new TrackerClass()
let initialized = false

export function initTracker(): void {
  if (!initialized) {
    tracker.init()
    initialized = true
  }
}

export function reachGoal(name: string): void {
  if (!initialized) throw new Error('Tracker was not initialized')
  tracker.reachGoal(name)
}
