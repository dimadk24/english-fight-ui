import React, { useEffect, useReducer, useState } from 'react'
import PropTypes, { InferProps } from 'prop-types'
import PanelHeader from '../helpers/PanelHeader'
import { BattleService } from './BattleService'
import Question from '../Question'
import { Utils } from '../../Utils'
import { battleActions, battleReducer, initialState } from './battle-reducer'
import Loader from '../helpers/Loader'

const WAIT_TIME_TO_SHOW_CORRECT_ANSWER = 1000

const Battle = ({
  onGoBack,
  onFinishGame,
}: InferProps<typeof Battle.propTypes>): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(battleReducer, initialState)
  const { battle, activeQuestion, hasNextQuestion } = state

  useEffect(() => {
    const startBattle = async () => {
      setLoading(true)
      try {
        const fetchedBattle = await BattleService.startBattle()
        dispatch({
          type: battleActions.setBattle,
          payload: fetchedBattle,
        })
      } finally {
        setLoading(false)
      }
    }
    startBattle()
  }, [])

  const onSelectAnswer = async (answer) => {
    const questionToSubmit = activeQuestion.set('selectedAnswer', answer)
    setLoading(true)
    try {
      const questionWithAnswerData = await BattleService.submitQuestion(
        questionToSubmit
      )
      dispatch({
        type: battleActions.updateQuestion,
        payload: questionWithAnswerData,
      })
    } finally {
      setLoading(false)
    }

    await Utils.waitForTimeout(WAIT_TIME_TO_SHOW_CORRECT_ANSWER)

    if (hasNextQuestion) dispatch({ type: battleActions.goToNextQuestion })
    else onFinishGame(battle)
  }

  return (
    <>
      <PanelHeader onBackButtonClick={onGoBack} text="Игра" />
      {activeQuestion && (
        <Question {...activeQuestion} onSelectAnswer={onSelectAnswer} />
      )}
      {loading && <Loader />}
    </>
  )
}

Battle.propTypes = {
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
