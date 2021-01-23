import React, { useState } from 'react'
import PropTypes, { InferProps } from 'prop-types'
import PanelHeader from '../helpers/PanelHeader'
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell'
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter'
import Group from '@vkontakte/vkui/dist/components/Group/Group'
import Header from '@vkontakte/vkui/dist/components/Header/Header'
import Button from '@vkontakte/vkui/dist/components/Button/Button'
import './Results.css'
import Icon24Home from '@vkontakte/icons/dist/24/home'
import Icon24Replay from '@vkontakte/icons/dist/24/replay'
import { NOTIFICATIONS_STATUSES } from '../../constants'
import { AppService } from '../AppService'
import { Caption, Card, CardGrid, Div } from '@vkontakte/vkui'
import Loader from '../helpers/Loader'

function Results({
  user,
  onGoBack,
  battle,
  onRetry,
  onUpdateUser,
}: InferProps<typeof Results.propTypes>): JSX.Element {
  const { questions, points } = battle
  const correctAnswersNumber = questions.filter(({ isCorrect }) => isCorrect)
    .length
  const incorrectAnswersNumber = questions.length - correctAnswersNumber
  const [rejectedNotifications, setRejectedNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  const showNotificationsRequest =
    user.notificationsStatus === NOTIFICATIONS_STATUSES.TO_BE_REQUESTED

  const navigationButtons = (
    <div className="action-buttons-wrapper">
      <Button onClick={onGoBack} size="l" before={<Icon24Home />}>
        Домой
      </Button>
      <Button onClick={onRetry} size="l" before={<Icon24Replay />}>
        Еще раз
      </Button>
    </div>
  )

  const notificationRequest = (
    <CardGrid style={{ marginTop: '10px' }}>
      <Card size="l" style={{ padding: '10px' }}>
        <div className="notification-request-content">
          <span className="notification-request-header">
            Узнай первым об обновлениях - подпишись на уведомления!
          </span>
          <div className="notification-buttons-wrapper">
            <Button
              size="m"
              mode="commerce"
              className="notification-button"
              onClick={async () => {
                setLoading(true)
                try {
                  const updatedUser = await AppService.requestNotifications()
                  onUpdateUser(updatedUser)
                  if (
                    updatedUser.notificationsStatus ===
                    NOTIFICATIONS_STATUSES.BLOCK
                  ) {
                    // if user clicked subscribe, but rejected in VK popup
                    setRejectedNotifications(true)
                  }
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
            >
              Подписаться
            </Button>
            <Button
              size="m"
              mode="secondary"
              className="notification-button"
              onClick={async () => {
                setLoading(true)
                onUpdateUser(await AppService.blockNotifications())
                setLoading(false)
                setRejectedNotifications(true)
              }}
              disabled={loading}
            >
              Не сейчас
            </Button>
          </div>
          <Caption
            level="4"
            weight="regular"
            className="notification-request-subtext"
          >
            Всегда можно отписаться на главном экране
          </Caption>
        </div>
      </Card>
    </CardGrid>
  )
  return (
    <>
      <PanelHeader text="Результаты" onBackButtonClick={onGoBack} />
      <Group header={<Header mode="secondary">Статистика</Header>}>
        <Cell
          indicator={<Counter mode="primary">{correctAnswersNumber}</Counter>}
        >
          Верных ответов:
        </Cell>
        <Cell
          indicator={<Counter mode="primary">{incorrectAnswersNumber}</Counter>}
        >
          Неверных ответов:
        </Cell>
        <Cell indicator={<Counter mode="primary">{points}</Counter>}>
          Получено очков:
        </Cell>
      </Group>
      {!showNotificationsRequest && navigationButtons}
      {showNotificationsRequest && notificationRequest}
      {rejectedNotifications && (
        <Div className="subscribe-later">
          Подписаться можно на главном экране
        </Div>
      )}
      {loading && <Loader />}
    </>
  )
}

Results.propTypes = {
  user: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    foreverRank: PropTypes.number.isRequired,
    monthlyRank: PropTypes.number.isRequired,
    notificationsStatus: PropTypes.string.isRequired,
  }),
  onGoBack: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  battle: PropTypes.shape({
    points: PropTypes.number.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        isCorrect: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }),
  onUpdateUser: PropTypes.func.isRequired,
}

Results.defaultProps = {
  user: null,
  battle: null,
}

export default Results
