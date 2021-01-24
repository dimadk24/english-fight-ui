import React, { useState } from 'react'
import PropTypes, { InferProps } from 'prop-types'
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

const Home = ({
  onStartBattle,
  user,
  onUpdateUser,
}: InferProps<typeof Home.propTypes>): JSX.Element => {
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
          <Button size="xl" onClick={onStartBattle} disabled={loading}>
            Начать!
          </Button>
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

Home.propTypes = {
  onStartBattle: PropTypes.func.isRequired,
  user: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    foreverRank: PropTypes.number.isRequired,
    monthlyRank: PropTypes.number.isRequired,
    notificationsStatus: PropTypes.string.isRequired,
  }),
  onUpdateUser: PropTypes.func.isRequired,
}

Home.defaultProps = {
  user: null,
}

export default Home
