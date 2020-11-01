import bridge from '@vkontakte/vk-bridge'
// import { ApiService } from '../ApiService'

export class AppService {
  static async fetchUserData() {
    const promises = [
      bridge.send('VKWebAppGetUserInfo'),
      // ApiService.get('user'),
    ]
    const [vkUserData] = await Promise.all(promises)
    return {
      id: 1,
      vkId: vkUserData.id,
      firstName: vkUserData.first_name,
      lastName: vkUserData.last_name,
      photoUrl: vkUserData.photo_200,
      score: 1,
    }
  }
}
