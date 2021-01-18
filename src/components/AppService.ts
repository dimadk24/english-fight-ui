import { ApiService } from '../core/ApiService'
import { User, UserInstance } from '../core/user-model'

export class AppService {
  static async fetchUserData(): Promise<UserInstance> {
    return ApiService.get<UserInstance>('user', { Model: User })
  }
}
