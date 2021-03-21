import React, { useState } from 'react'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import Group from '@vkontakte/vkui/dist/components/Group/Group'
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell'
import Div from '@vkontakte/vkui/dist/components/Div/Div'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar'
import PanelHeader from '../helpers/PanelHeader'
import { Switch } from '@vkontakte/vkui'
import { AppService } from '../AppService'
import { UserInstance } from '../../core/user-model'
import Loader from '../helpers/Loader'
import { NOTIFICATIONS_STATUSES } from '../../constants'

type Props = {
  onStartSingleGame(): void
  onStartMultiplayerGame(): void
  user: UserInstance
  onUpdateUser(user: UserInstance): void
}
const Home = ({
  onStartSingleGame,
  onStartMultiplayerGame,
  user = null,
  onUpdateUser,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const onSwitchNotifications = async (event) => {
    const { checked: newChecked } = event.target
    setLoading(true)
    try {
      let updatedUser: UserInstance
      if (newChecked) {
        // need to enable
        updatedUser = await AppService.requestNotifications()
      } else {
        // need to disable
        updatedUser = await AppService.blockNotifications()
      }
      onUpdateUser(updatedUser)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PanelHeader text="English Clash" showBackButton={false} />
      {user && (
        <Group>
          <Cell
            before={user.photoUrl ? <Avatar src={user.photoUrl} /> : null}
            description={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Количество очков - {user.score}</span>{' '}
                <span>Место в рейтинге: {user.foreverRank}</span>
              </div>
            }
            multiline
          >
            {`${user.firstName} ${user.lastName}`}
          </Cell>
        </Group>
      )}

      <Group>
        <Div>
          <Cell>
            <Button size="xl" onClick={onStartSingleGame} disabled={loading}>
              Начать одиночную игру
            </Button>
          </Cell>
          <Cell>
            <Button
              size="xl"
              onClick={onStartMultiplayerGame}
              disabled={loading}
            >
              Играть с другом
            </Button>
          </Cell>
        </Div>
      </Group>

      {user && (
        <Group>
          <Cell
            multiline
            indicator={
              <Switch
                checked={
                  user.notificationsStatus === NOTIFICATIONS_STATUSES.ALLOW
                }
                onChange={onSwitchNotifications}
                disabled={loading}
              />
            }
          >
            Уведомления об обновлениях
          </Cell>
        </Group>
      )}
      {loading && <Loader />}
    </>
  )
}

export default Home
