import React from 'react'
import { ScoreboardUserInstance } from '../../../models/scoreboard-user-model'
import PanelHeader from '../../helpers/PanelHeader'
import { Cell, Group } from '@vkontakte/vkui'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar'
import styles from './MultiplayerResults.module.css'
import Loader from '../../helpers/Loader'
import HomeButton from '../../helpers/HomeButton'

export type MultiplayerResultItem = {
  user: ScoreboardUserInstance
  points: number
  correctAnswersNumber: number
  totalQuestions: number
}

type Props = {
  onGoBack(): void
  items: MultiplayerResultItem[]
  playersNumber: number
}

function MultiplayerResults({
  onGoBack,
  items,
  playersNumber,
}: Props): JSX.Element {
  const loaderText =
    playersNumber === 2 ? 'ожидаем другого игрока' : 'ожидаем других игроков'
  return (
    <>
      <PanelHeader text="Результаты" onBackButtonClick={onGoBack} />
      <Group>
        <div>
          <Cell>
            <div className={styles.headerRow}>
              <span className={styles.nameHeader}>Игрок</span>
              <span className={styles.answersHeader}>Верных ответов</span>
              <span>Счет</span>
            </div>
          </Cell>
          {items.map(
            ({ user, correctAnswersNumber, totalQuestions, points }) => (
              <Cell key={user.id} className={styles.dataRowWrapper}>
                <div className={styles.dataRow}>
                  <Avatar src={user.photoUrl} />
                  <span className={styles.name}>{user.firstName}</span>
                  <span className={styles.answers}>
                    {correctAnswersNumber} из {totalQuestions}
                  </span>
                  <span>{points}</span>
                </div>
              </Cell>
            )
          )}
        </div>
        {items.length < playersNumber && (
          <>
            <Loader />
            <div className={styles.loaderText}>{loaderText}</div>
          </>
        )}
        <div className={styles.homeButtonWrapper}>
          <HomeButton onClick={onGoBack} />
        </div>
      </Group>
    </>
  )
}

export default MultiplayerResults
