import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel'
import PanelHeader from '../helpers/PanelHeader'
import { BattleService } from './BattleService'
import Question from '../Question'
import { PanelSpinner } from '@vkontakte/vkui'
import { Utils } from '../../Utils'
import { battleActions, battleReducer, initialState } from './battle-reducer'

const Battle = ({ id: panelId, onGoBack, onFinishGame }) => {
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(battleReducer, initialState)
  const { battle, activeQuestion, hasNextQuestion } = state

  useEffect(() => {
    const startBattle = async () => {
      setLoading(true)
      const fetchedBattle = await BattleService.startBattle()
      dispatch({
        type: battleActions.setBattle,
        payload: fetchedBattle,
      })
      setLoading(false)
    }
    startBattle()
  }, [])

  const onSelectAnswer = async (answer) => {
    const questionToSubmit = {
      ...activeQuestion,
      selectedAnswer: answer,
    }
    setLoading(true)
    const questionWithAnswerData = await BattleService.submitQuestion(
      questionToSubmit
    )
    setLoading(false)
    dispatch({
      type: battleActions.updateQuestion,
      payload: questionWithAnswerData,
    })

    await Utils.waitForTimeout(2000)

    if (hasNextQuestion) dispatch({ type: battleActions.goToNextQuestion })
    else onFinishGame(battle)
  }

  return (
    <Panel id={panelId}>
      <PanelHeader onBackButtonClick={onGoBack} text="Сражение" />
      {activeQuestion && (
        <Question {...activeQuestion} onSelectAnswer={onSelectAnswer} />
      )}
      {loading && <PanelSpinner size="large" />}
    </Panel>
  )
}

Battle.propTypes = {
  id: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onFinishGame: PropTypes.func.isRequired,
  user: PropTypes.shape({
    photoUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }),
}

Battle.defaultProps = {
  user: null,
}

export default Battle
