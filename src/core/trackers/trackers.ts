import { Utils } from '../../Utils'
import { MetrikaTracker } from './MetrikaTracker'
import { PosthogTracker } from './PosthogTracker'
import { LocalTracker } from './LocalTracker'
import { VkPixelTracker } from './VkPixelTracker'

const registeredTrackers = Utils.isProductionMode
  ? [MetrikaTracker, PosthogTracker, VkPixelTracker]
  : [LocalTracker]

function call(method: string, ...args: Array<unknown>) {
  registeredTrackers.forEach((tracker) => {
    if (
      tracker.AUTOMATIC_OPERATIONS[0] === '*' ||
      tracker.AUTOMATIC_OPERATIONS.includes(method)
    )
      tracker[method](...args)
  })
}

export const trackers = {
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
