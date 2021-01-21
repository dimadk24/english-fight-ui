import { Utils } from '../../Utils'
import { MetrikaTracker } from './MetrikaTracker'
import { PosthogTracker } from './PosthogTracker'
import { LocalTracker } from './LocalTracker'

const trackers = Utils.isProductionMode
  ? [MetrikaTracker, PosthogTracker]
  : [LocalTracker]

function call(method: string, ...args: Array<unknown>) {
  trackers.forEach((tracker) => {
    tracker[method](...args)
  })
}

export const tracker = {
  identify(id: number, vkId: number): void {
    call('identify', id, vkId)
  },

  init(): void {
    call('init')
  },

  reachGoal(name: string): void {
    call('reachGoal', name)
  },
}
