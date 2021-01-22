import React from 'react'
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

function Results({
  onGoBack,
  battle,
  onRetry,
}: InferProps<typeof Results.propTypes>): JSX.Element {
  const { questions, points } = battle
  const correctAnswersNumber = questions.filter(({ isCorrect }) => isCorrect)
    .length
  const incorrectAnswersNumber = questions.length - correctAnswersNumber
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
      <div className="action-buttons-wrapper">
        <Button onClick={onGoBack} size="l" before={<Icon24Home />}>
          Домой
        </Button>
        <Button onClick={onRetry} size="l" before={<Icon24Replay />}>
          Еще раз
        </Button>
      </div>
    </>
  )
}

Results.propTypes = {
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
}

Results.defaultProps = {
  battle: null,
}

export default Results
