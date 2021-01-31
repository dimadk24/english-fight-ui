import { ApiService } from '../core/ApiService'
import { User, UserInstance } from '../core/user-model'
import { NOTIFICATIONS_STATUSES } from '../constants'
import bridge from '@vkontakte/vk-bridge'
import { Utils } from '../Utils'
import { trackers } from '../core/trackers/trackers'

export class AppService {
  static areNotificationsEnabledOnVkSide = Boolean(
    parseInt(Utils.getSearchParam('vk_are_notifications_enabled'), 10)
  )

  static async fetchUserData(): Promise<UserInstance> {
    return ApiService.get<UserInstance>('user', { Model: User })
  }

  static async allowNotifications(): Promise<UserInstance> {
    trackers.reachGoal('allow-notifications')
    return ApiService.patch<UserInstance>(
      'user',
      { notificationsStatus: NOTIFICATIONS_STATUSES.ALLOW },
      { Model: User }
    )
  }

  static async blockNotifications(): Promise<UserInstance> {
    trackers.reachGoal('block-notifications')
    return ApiService.patch<UserInstance>(
      'user',
      { notificationsStatus: NOTIFICATIONS_STATUSES.BLOCK },
      { Model: User }
    )
  }

  static async requestNotifications(): Promise<UserInstance> {
    if (AppService.areNotificationsEnabledOnVkSide) {
      // already allowed in VK, need only to allow on our backend
      return AppService.allowNotifications()
    }
    try {
      const { result } = await bridge.send('VKWebAppAllowNotifications')
      if (result) return AppService.allowNotifications()
    } catch (e) {
      // rejected
      if (
        e.error_type === 'client_error' &&
        e.error_data &&
        e.error_data.error_code === 4 &&
        e.error_data.error_reason === 'User denied'
      )
        return AppService.blockNotifications()
      throw e
    }
  }
}
