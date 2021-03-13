import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import '@vkontakte/vkui/dist/vkui.css'
import './constant-styles.css'
import { Utils } from '../Utils'
import { trackers } from '../core/trackers/trackers'
import { Epic, Panel, Tabbar, TabbarItem, View } from '@vkontakte/vkui'
import { GameInstance } from '../models/game-model'
import { BattleService } from './panels/BattleService'
import Home from './panels/Home'
import Battle from './panels/Battle'
import SingleplayerResults from './panels/SingleplayerResults'
import { Icon28HomeOutline, Icon28UsersOutline } from '@vkontakte/icons'
import ScoreboardHome from './panels/ScoreboardHome'
import { DELAY_BEFORE_LOADER, GameModes, GameType } from '../constants'
import { UserInstance } from '../core/user-model'
import ChooseGameType from './panels/ChooseGameType'
import { VkPixelTracker } from '../core/trackers/VkPixelTracker'
import Lobby from './panels/Lobby/Lobby'
import {
  GameDefinition,
  GameDefinitionInstance,
} from '../models/game-definition-model'
import {
  ApiService,
  frontendWebsocketCloseCodes,
  JsonWebSocket,
} from '../core/ApiService'
import { URLUtils } from '../URLUtils'
import ChooseMultiplayerGameAction from './panels/ChooseMultiplayerGameAction/ChooseMultiplayerGameAction'
import JoinMultiplayerGame from './panels/JoinMultiplayerGame/JoinMultiplayerGame'
import MultiplayerResults, {
  MultiplayerResultItem,
} from './panels/MultiplayerResults/MultiplayerResults'
import { ScoreboardUserInstance } from '../models/scoreboard-user-model'
import { FinishedGameData } from '../websocket-data-types'
import useStateRef from '../core/hooks/use-state-ref'
import useFeatureFlag from '../core/hooks/use-feature-flag'
import { MULTIPLAYER } from '../core/feature-flags'

type Props = {
  user: UserInstance | null
  loadingUser: boolean
  setUser(user: UserInstance): void
  refreshUser(): void
  popout: JSX.Element | null
}

const App = ({
  user,
  loadingUser,
  setUser,
  refreshUser,
  popout,
}: Props): JSX.Element => {
  const [loadingMultiplayerGameDef, setLoadingMultiplayerGameDef] = useState(
    false
  )
  const [loadingSinglePlayerGame, setLoadingSinglePlayerGame] = useState(false)
  const [loadingTooLong, setLoadingTooLong] = useState(false)
  const [activeStory, setActiveStory] = useState('game')
  const [activePanel, setActivePanel] = useState('home')
  const [battle, setBattle] = useState<GameInstance | null>(null)
  const [gameType, setGameType] = useState<GameType | null>(null)
  const [gameMode, setGameMode] = useState<GameModes | null>(null)
  const [
    multiplayerGameDef,
    setMultiplayerDameDef,
    multiplayerGameDefRef,
  ] = useStateRef<GameDefinitionInstance | null>(null)
  const [game, setGame] = useState<GameInstance | null>(null)
  const [multiplayerFinishedItems, setMultiplayerFinishedItems] = useState<
    MultiplayerResultItem[]
  >([])
  const multiplayerSocket = useRef<JsonWebSocket | null>(null)
  const { enabled: multiplayerEnabled } = useFeatureFlag(MULTIPLAYER)

  const joinedMultiplayerGame = useCallback(
    ({ instance }: { instance: GameDefinitionInstance }) => {
      setMultiplayerDameDef(instance)
    },
    [setMultiplayerDameDef]
  )

  const startedMultiplayerGame = useCallback(
    async (
      { instance }: { instance: GameInstance },
      joinedTimestamp?: number
    ) => {
      setGame(instance)
      if (joinedTimestamp) {
        const SWITCH_PANEL_TIME = 900 // ms
        // workaround https://github.com/VKCOM/VKUI/issues/177
        await Utils.waitTillTimestamp(joinedTimestamp + SWITCH_PANEL_TIME)
      }
      setActivePanel('battle')
    },
    []
  )

  const finishedMultiplayerGame = useCallback(
    ({
      instance,
      data,
    }: {
      instance: ScoreboardUserInstance
      data: FinishedGameData
    }) => {
      setMultiplayerFinishedItems((currentItems) => {
        if (
          currentItems.length ===
          multiplayerGameDefRef.current.players.length - 1
        ) {
          multiplayerSocket.current.close(
            frontendWebsocketCloseCodes.FINISH_GAME
          )
        }
        return [
          ...currentItems,
          {
            user: instance,
            ...data,
          },
        ]
      })
    },
    [multiplayerGameDefRef, multiplayerSocket]
  )

  useEffect(() => {
    setMultiplayerFinishedItems([])
  }, [multiplayerGameDef])

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
        multiplayerSocket.current = ApiService.openSocketConnection(
          `multiplayer-game/${gameDefId}`,
          {
            joinedGame: joinedMultiplayerGame,
            startedGame: ({ instance }: { instance: GameInstance }) =>
              startedMultiplayerGame(
                { instance },
                joinedMultiplayerGameTimestamp
              ),
            finishedGame: finishedMultiplayerGame,
          }
        )
      } catch (e) {
        if (e.message === 'Страница не найдена.')
          throw new Error('Игра для подключения не найдена')
        else throw e
      } finally {
        setLoadingMultiplayerGameDef(false)
      }
    },
    [
      startedMultiplayerGame,
      finishedMultiplayerGame,
      joinedMultiplayerGame,
      setMultiplayerDameDef,
    ]
  )

  useEffect(() => {
    if (!multiplayerEnabled) return
    const joinGameDefId = URLUtils.getHashParam('gid')
    if (joinGameDefId) {
      joinMultiplayerGame(joinGameDefId)
      setGameMode(GameModes.multi)
    }
  }, [joinMultiplayerGame, multiplayerEnabled])

  const onFinishGame = async (localBattle: GameInstance) => {
    const updatedBattle = await BattleService.getBattle(localBattle.id)
    setBattle(updatedBattle)
    setActivePanel('results')
    trackers.reachGoal('finish-game')
    VkPixelTracker.reachGoal('conversion')
    refreshUser()
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
      multiplayerSocket.current = ApiService.openSocketConnection(
        `multiplayer-game/${gameDef.id}`,
        {
          joinedGame: ({ instance }: { instance: GameDefinitionInstance }) => {
            joinedMultiplayerGame({ instance })
            if (instance.players.length === 2) {
              multiplayerSocket.current.sendEvent('start-game')
              trackers.reachGoal('launch-multiplayer-game')
            }
          },
          startedGame: startedMultiplayerGame,
          finishedGame: finishedMultiplayerGame,
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

  useEffect(() => {
    if (gameMode === GameModes.multi && activeStory !== 'game') {
      multiplayerSocket.current.close(frontendWebsocketCloseCodes.CLOSE_GAME)
    }
  }, [activeStory, multiplayerSocket, gameMode])

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
            onGoBack={() => {
              goToChooseGameTypePanel(gameMode)
              multiplayerSocket.current.close(
                frontendWebsocketCloseCodes.CLOSE_GAME
              )
            }}
          />
        </Panel>
        <Panel id="battle">
          <Battle
            onGoBack={() => {
              goToChooseGameTypePanel(gameMode)
              if (gameMode === GameModes.multi)
                multiplayerSocket.current.close(
                  frontendWebsocketCloseCodes.CLOSE_GAME
                )
            }}
            onFinishGame={onFinishGame}
            gameType={gameType}
            gameMode={gameMode}
            game={game}
          />
        </Panel>
        <Panel id="results">
          {gameMode === GameModes.single && (
            <SingleplayerResults
              user={user}
              onRetry={() => onStartGame(gameType)}
              onGoBack={goToHomePanel}
              battle={battle}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
            />
          )}
          {gameMode === GameModes.multi && (
            <MultiplayerResults
              onGoBack={() => {
                goToHomePanel()
                multiplayerSocket.current.close(
                  frontendWebsocketCloseCodes.CLOSE_GAME
                )
              }}
              items={multiplayerFinishedItems}
              playersNumber={
                (multiplayerGameDef && multiplayerGameDef.players.length) || 0
              }
            />
          )}
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
