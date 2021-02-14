import React, { useEffect, useReducer, useState } from 'react'
import PanelHeader from '../helpers/PanelHeader'
import { BattleService } from './BattleService'
import Question from '../Question'
import { Utils } from '../../Utils'
import { battleActions, battleReducer, initialState } from './battle-reducer'
import Loader from '../helpers/Loader'
import { GameInstance } from '../../models/game-model'
import { GameType } from '../../constants'

const WAIT_TIME_TO_SHOW_CORRECT_ANSWER = 1000

interface PropTypes {
  gameType?: GameType
  onGoBack()
  onFinishGame(game: GameInstance)
}

const Battle = ({
  onGoBack,
  onFinishGame,
  gameType = null,
}: PropTypes): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(battleReducer, initialState)
  const { battle, activeQuestion, hasNextQuestion } = state

  useEffect(() => {
    const startBattle = async () => {
      setLoading(true)
      try {
        const fetchedGame = await BattleService.startSinglePlayerGame(gameType)
        dispatch({
          type: battleActions.setBattle,
          payload: fetchedGame,
        })
      } finally {
        setLoading(false)
      }
    }
    if (gameType) startBattle()
  }, [gameType])

  const onSelectAnswer = async (answer: string) => {
    if (loading) return
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
        <Question
          question={activeQuestion}
          onSelectAnswer={onSelectAnswer}
          gameType={gameType}
        />
      )}
      {loading && <Loader />}
    </>
  )
}

export default Battle
