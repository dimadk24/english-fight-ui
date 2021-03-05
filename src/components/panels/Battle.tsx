import React, { useEffect, useReducer, useState } from 'react'
import PanelHeader from '../helpers/PanelHeader'
import { BattleService } from './BattleService'
import Question from '../Question'
import { Utils } from '../../Utils'
import { battleActions, battleReducer, initialState } from './battle-reducer'
import Loader from '../helpers/Loader'
import { GameInstance } from '../../models/game-model'
import { GameModes, GameType } from '../../constants'
import useInterval from 'use-interval'
import { Div } from '@vkontakte/vkui'
import './Battle.css'

const WAIT_TIME_TO_SHOW_CORRECT_ANSWER = 1000

interface PropTypes {
  game?: GameInstance
  gameType?: GameType
  gameMode?: GameModes
  onGoBack()
  onFinishGame(game: GameInstance)
}

const Battle = ({
  onGoBack,
  onFinishGame,
  gameType = null,
  gameMode = null,
  game = null,
}: PropTypes): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(battleReducer, initialState)
  const { battle, activeQuestion, hasNextQuestion } = state
  const [timeBeforeStart, setTimeBeforeStart] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (game) {
      dispatch({
        type: battleActions.setBattle,
        payload: game,
      })
      if (gameMode === GameModes.multi) setTimeBeforeStart(3)
      else setGameStarted(true)
    }
  }, [game, gameMode])

  const decreaseStartMultiplayerGameTime = () => {
    if (timeBeforeStart === 1) setGameStarted(true)
    else setTimeBeforeStart(timeBeforeStart - 1)
  }
  const intervalDelay = battle && !gameStarted ? 1000 : null

  useInterval(decreaseStartMultiplayerGameTime, intervalDelay)

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
      {gameStarted && activeQuestion && (
        <Question
          question={activeQuestion}
          onSelectAnswer={onSelectAnswer}
          gameType={gameType}
        />
      )}
      {!gameStarted && (
        <Div className="start-game-timer">
          До начала игры: {timeBeforeStart}
        </Div>
      )}
      {loading && <Loader />}
    </>
  )
}

export default Battle
