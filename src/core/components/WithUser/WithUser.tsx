import { useEffect, useState } from 'react'
import { UserInstance } from '../../user-model'
import { AppService } from '../../../components/AppService'
import { NOTIFICATIONS_STATUSES } from '../../../constants'
import { trackers } from '../../trackers/trackers'

type Props = {
  children({
    user,
    loadingUser,
    setUser,
    refreshUser,
  }: {
    user: UserInstance | null
    loadingUser: boolean
    setUser(user: UserInstance): void
    refreshUser(): void
  }): JSX.Element
}

function WithUser({ children }: Props): JSX.Element {
  const [user, setUser] = useState<UserInstance | null>(null)
  const [loadingUser, setLoadingUser] = useState(false)

  async function fetchUser(isInitialRequest = false) {
    setLoadingUser(true)
    try {
      const fetchedUser = await AppService.fetchUserData()
      setUser(fetchedUser)
      if (isInitialRequest) {
        if (
          fetchedUser.notificationsStatus === NOTIFICATIONS_STATUSES.ALLOW &&
          !AppService.areNotificationsEnabledOnVkSide
        ) {
          setUser(await AppService.blockNotifications())
        }
        trackers.identify(fetchedUser.id, fetchedUser.vkId)
      }
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    fetchUser(true)
  }, [])

  return children({
    user,
    loadingUser,
    setUser,
    refreshUser: () => fetchUser(false),
  })
}

export default WithUser
