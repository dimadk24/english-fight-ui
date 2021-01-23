import { ApiService } from '../core/ApiService'
import { User, UserInstance } from '../core/user-model'
import { NOTIFICATIONS_STATUSES } from '../constants'
import bridge from '@vkontakte/vk-bridge'

export class AppService {
  static async fetchUserData(): Promise<UserInstance> {
    return ApiService.get<UserInstance>('user', { Model: User })
  }

  static async allowNotifications(): Promise<UserInstance> {
    return ApiService.patch<UserInstance>(
      'user',
      { notificationsStatus: NOTIFICATIONS_STATUSES.ALLOW },
      { Model: User }
    )
  }

  static async blockNotifications(): Promise<UserInstance> {
    return ApiService.patch<UserInstance>(
      'user',
      { notificationsStatus: NOTIFICATIONS_STATUSES.BLOCK },
      { Model: User }
    )
  }

  static async requestNotifications(): Promise<UserInstance> {
    try {
      const { result } = await bridge.send('VKWebAppAllowNotifications')
      if (result) return AppService.allowNotifications()
    } catch (e) {
      // rejected
      return AppService.blockNotifications()
    }
  }
}
