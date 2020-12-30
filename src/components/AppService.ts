import bridge, { UserInfo } from '@vkontakte/vk-bridge'
import { ApiService } from '../core/ApiService'
import { User, UserInstance } from '../core/user-model'

type ApiUserInfo = { id: number; vkId: number; score: number }

export class AppService {
  static async fetchUserData(): Promise<UserInstance> {
    const promises: [Promise<UserInfo>, Promise<ApiUserInfo>] = [
      bridge.send('VKWebAppGetUserInfo'),
      ApiService.get<ApiUserInfo>('user'),
    ]
    const [vkUserData, apiUserData] = await Promise.all(promises)
    return User.fromObject({
      id: apiUserData.id,
      vkId: apiUserData.vkId,
      firstName: vkUserData.first_name,
      lastName: vkUserData.last_name,
      photoUrl: vkUserData.photo_200,
      score: apiUserData.score,
    })
  }
}
