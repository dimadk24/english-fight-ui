import React from 'react'
import { ScoreboardUserInstance } from '../../../models/scoreboard-user-model'
import PanelHeader from '../../helpers/PanelHeader'
import { Cell, Group } from '@vkontakte/vkui'
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar'
import styles from './MultiplayerResults.module.css'

export type MultiplayerResultItem = {
  user: ScoreboardUserInstance
  points: number
  correctAnswersNumber: number
  totalQuestions: number
}

type Props = {
  onGoBack(): void
  items: MultiplayerResultItem[]
}

function MultiplayerResults({ onGoBack, items }: Props): JSX.Element {
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
      </Group>
    </>
  )
}

export default MultiplayerResults
