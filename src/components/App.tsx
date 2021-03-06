import React, { useCallback, useEffect, useState } from 'react'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert'
import '@vkontakte/vkui/dist/vkui.css'
import { AppService } from './AppService'
import './constant-styles.css'
import { Utils } from '../Utils'
import * as Sentry from '@sentry/react'
import styles from './App.module.css'
import { trackers } from '../core/trackers/trackers'
import { Epic, Panel, Tabbar, TabbarItem, View } from '@vkontakte/vkui'
import { GameInstance } from '../models/game-model'
import { BattleService } from './panels/BattleService'
import Home from './panels/Home'
import Battle from './panels/Battle'
import SingleplayerResults from './panels/SingleplayerResults'
import { Icon28HomeOutline, Icon28UsersOutline } from '@vkontakte/icons'
import ScoreboardHome from './panels/ScoreboardHome'
import {
  DELAY_BEFORE_LOADER,
  GameModes,
  GameType,
  NOTIFICATIONS_STATUSES,
} from '../constants'
import { UserInstance } from '../core/user-model'
import ChooseGameType from './panels/ChooseGameType'
import { VkPixelTracker } from '../core/trackers/VkPixelTracker'
import Lobby from './panels/Lobby/Lobby'
import {
  GameDefinition,
  GameDefinitionInstance,
} from '../models/game-definition-model'
import { ApiService } from '../core/ApiService'
import { URLUtils } from '../URLUtils'
import ChooseMultiplayerGameAction from './panels/ChooseMultiplayerGameAction/ChooseMultiplayerGameAction'
import JoinMultiplayerGame from './panels/JoinMultiplayerGame/JoinMultiplayerGame'

const App = (): JSX.Element => {
  const [user, setUser] = useState<UserInstance | null>(null)
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingMultiplayerGameDef, setLoadingMultiplayerGameDef] = useState(
    false
  )
  const [loadingSinglePlayerGame, setLoadingSinglePlayerGame] = useState(false)
  const [loadingTooLong, setLoadingTooLong] = useState(false)
  const [popout, setPopout] = useState<JSX.Element | null>(null)
  const [activeStory, setActiveStory] = useState('game')
  const [activePanel, setActivePanel] = useState('home')
  const [battle, setBattle] = useState<GameInstance | null>(null)
  const [gameType, setGameType] = useState<GameType | null>(null)
  const [gameMode, setGameMode] = useState<GameModes | null>(null)
  const [
    multiplayerGameDef,
    setMultiplayerDameDef,
  ] = useState<GameDefinitionInstance | null>(null)
  const [game, setGame] = useState<GameInstance | null>(null)

  useEffect(() => {
    if (Utils.isProductionMode) {
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        beforeSend(event, hint) {
          if (event.exception) {
            const errorMessage =
              hint &&
              hint.originalException &&
              hint.originalException instanceof Error &&
              hint.originalException.message
                ? hint.originalException.message
                : ''
            setPopout(
              <Alert
                actions={[
                  {
                    mode: 'default',
                    title: 'ОК',
                    autoclose: true,
                  },
                ]}
                onClose={() => setPopout(null)}
              >
                <h2>Возникла ошибка =(</h2>
                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}
                <p>Попробуй еще раз</p>
              </Alert>
            )
          }
          return event
        },
      })
    }
    trackers.init()
    trackers.reachGoal('open app')
  }, [])

  async function fetchUser(isInitialRequest: boolean) {
    setLoadingUser(true)
    try {
      const fetchedUser = await AppService.fetchUserData()
      setUser(fetchedUser)
      if (isInitialRequest) {
        if (
          fetchedUser.notificationsStatus === NOTIFICATIONS_STATUSES.ALLOW &&
          !AppService.areNotificationsEnabledOnVkSide
        ) {
          setUser(await AppService.blockNotifications())
        }
        trackers.identify(fetchedUser.id, fetchedUser.vkId)
      }
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    fetchUser(true)
  }, [])

  const joinedMultiplayerGame = ({
    instance,
  }: {
    instance: GameDefinitionInstance
  }) => {
    setMultiplayerDameDef(instance)
  }

  const startedMultiplayerGame = useCallback(
    async (
      { instance }: { instance: GameInstance },
      joinedTimestamp?: number
    ) => {
      setGame(instance)
      if (joinedTimestamp) {
        const SWITCH_PANEL_TIME = 800 // ms
        // workaround https://github.com/VKCOM/VKUI/issues/177
        await Utils.waitTillTimestamp(joinedTimestamp + SWITCH_PANEL_TIME)
      }
      setActivePanel('battle')
    },
    []
  )

  const joinMultiplayerGame = useCallback(
    async (gameDefId) => {
      setLoadingMultiplayerGameDef(true)
      try {
        const gameDefinition = await ApiService.get<GameDefinitionInstance>(
          `game_definition/${gameDefId}`,
          { Model: GameDefinition }
        )
        setMultiplayerDameDef(gameDefinition)
        const joinedMultiplayerGameTimestamp = new Date().getTime()
        setActivePanel('lobby')
        setGameType(gameDefinition.type)
        ApiService.openSocketConnection(`multiplayer-game/${gameDefId}`, {
          joinedGame: joinedMultiplayerGame,
          startedGame: ({ instance }: { instance: GameInstance }) =>
            startedMultiplayerGame(
              { instance },
              joinedMultiplayerGameTimestamp
            ),
        })
      } catch (e) {
        if (e.message === 'Страница не найдена.')
          throw new Error('Игра для подключения не найдена')
        else throw e
      } finally {
        setLoadingMultiplayerGameDef(false)
      }
    },
    [startedMultiplayerGame]
  )

  useEffect(() => {
    const joinGameDefId = URLUtils.getHashParam('gid')
    if (joinGameDefId) {
      joinMultiplayerGame(joinGameDefId)
    }
  }, [joinMultiplayerGame])

  const onFinishGame = async (localBattle: GameInstance) => {
    const updatedBattle = await BattleService.getBattle(localBattle.id)
    setBattle(updatedBattle)
    setActivePanel('results')
    trackers.reachGoal('finish-game')
    VkPixelTracker.reachGoal('conversion')
    fetchUser(false)
  }

  const goToHomePanel = () => setActivePanel('home')

  const goToChooseGameTypePanel = (gameModeToSet: GameModes) => {
    if (gameModeToSet !== gameMode) setGameMode(gameModeToSet)
    setActivePanel('choose-game-type')
  }

  async function createMultiplayerGameDefinition(
    gameDefType: GameType
  ): Promise<GameDefinitionInstance> {
    const createdGameDefinition = await ApiService.post<GameDefinitionInstance>(
      'game_definition',
      { type: gameDefType },
      { Model: GameDefinition }
    )
    setMultiplayerDameDef(createdGameDefinition)
    return createdGameDefinition
  }

  const startSinglePlayerGame = async (chosenGameType: GameType) => {
    setLoadingSinglePlayerGame(true)
    try {
      const fetchedGame = await BattleService.startSinglePlayerGame(
        chosenGameType
      )
      setGame(fetchedGame)
    } finally {
      setLoadingSinglePlayerGame(false)
    }
  }

  const onStartGame = async (chosenGameType: GameType) => {
    if (chosenGameType !== gameType) setGameType(chosenGameType)
    if (gameMode === GameModes.single) {
      await startSinglePlayerGame(chosenGameType)
      setActivePanel('battle')
    } else {
      const gameDefPromise = createMultiplayerGameDefinition(chosenGameType)
      setActivePanel('lobby')
      const gameDef = await gameDefPromise
      const socket = ApiService.openSocketConnection(
        `multiplayer-game/${gameDef.id}`,
        {
          joinedGame: ({ instance }: { instance: GameDefinitionInstance }) => {
            joinedMultiplayerGame({ instance })
            if (instance.players.length === 2) socket.sendEvent('start-game')
          },
          startedGame: startedMultiplayerGame,
        }
      )
    }
    trackers.reachGoal('start-game', { type: chosenGameType, mode: gameMode })
  }

  const onOpenScoreboard = () => {
    setActiveStory('scoreboard')
    setActivePanel('scoreboard-home')
  }

  const loading =
    loadingUser || loadingMultiplayerGameDef || loadingSinglePlayerGame

  useEffect(() => {
    let timerId: number
    if (loading)
      timerId = window.setTimeout(() => {
        setLoadingTooLong(true)
      }, DELAY_BEFORE_LOADER)
    else setLoadingTooLong(false)
    return () => {
      clearTimeout(timerId)
    }
  }, [loading])

  let popoutToRender: JSX.Element | null = null
  if (popout) popoutToRender = popout
  else if (loading && loadingTooLong) popoutToRender = <ScreenSpinner />

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        <Tabbar>
          <TabbarItem
            text="Главная"
            selected={activeStory === 'game'}
            onClick={() => {
              setActiveStory('game')
              setActivePanel('home')
            }}
          >
            <Icon28HomeOutline />
          </TabbarItem>
          <TabbarItem
            text="Рейтинг"
            selected={activeStory === 'scoreboard'}
            onClick={onOpenScoreboard}
          >
            <Icon28UsersOutline />
          </TabbarItem>
        </Tabbar>
      }
    >
      <View id="game" activePanel={activePanel} popout={popoutToRender}>
        <Panel id="home">
          <Home
            user={user}
            onStartSingleGame={() => goToChooseGameTypePanel(GameModes.single)}
            onStartMultiplayerGame={() => {
              setGameMode(GameModes.multi)
              setActivePanel('choose-multiplayer-game-action')
            }}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
          />
        </Panel>
        <Panel id="choose-multiplayer-game-action">
          <ChooseMultiplayerGameAction
            onCreateNew={() => {
              setActivePanel('choose-game-type')
            }}
            onJoin={() => {
              setActivePanel('join-multiplayer-game')
            }}
            onGoBack={goToHomePanel}
          />
        </Panel>
        <Panel id="choose-game-type">
          <ChooseGameType
            onGoBack={() => {
              if (gameMode === GameModes.multi)
                setActivePanel('choose-multiplayer-game-action')
              else goToHomePanel()
            }}
            onChoose={onStartGame}
          />
        </Panel>
        <Panel id="join-multiplayer-game">
          <JoinMultiplayerGame
            onJoin={(gameDefinitionId) => {
              joinMultiplayerGame(gameDefinitionId)
            }}
            onBack={() => {
              setActivePanel('choose-multiplayer-game-action')
            }}
          />
        </Panel>
        <Panel id="lobby">
          <Lobby
            gameDefinition={multiplayerGameDef}
            onGoBack={() => goToChooseGameTypePanel(gameMode)}
          />
        </Panel>
        <Panel id="battle">
          <Battle
            onGoBack={() => goToChooseGameTypePanel(gameMode)}
            onFinishGame={onFinishGame}
            gameType={gameType}
            gameMode={gameMode}
            game={game}
          />
        </Panel>
        <Panel id="results">
          <SingleplayerResults
            user={user}
            onRetry={() => onStartGame(gameType)}
            onGoBack={goToHomePanel}
            battle={battle}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
          />
        </Panel>
      </View>
      <View id="scoreboard" activePanel={activePanel} popout={popout}>
        <Panel id="scoreboard-home">
          <ScoreboardHome user={user} />
        </Panel>
      </View>
    </Epic>
  )
}

export default App
