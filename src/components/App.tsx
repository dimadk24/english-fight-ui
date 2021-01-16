import React, { useEffect, useState } from 'react'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert'
import '@vkontakte/vkui/dist/vkui.css'
import { AppService } from './AppService'
import './constant-styles.css'
import { Utils } from '../Utils'
import * as Sentry from '@sentry/react'
import './App.css'
import { initTracker, reachGoal } from '../core/tracker'
import { Epic, Panel, Tabbar, TabbarItem, View } from '@vkontakte/vkui'
import { GameInstance } from '../models/game-model'
import { BattleService } from './panels/BattleService'
import Home from './panels/Home'
import Battle from './panels/Battle'
import Results from './panels/Results'
import { Icon28Game, Icon28UsersOutline } from '@vkontakte/icons'

const App = (): JSX.Element => {
  const [user, setUser] = useState(null)
  const [popout, setPopout] = useState(<ScreenSpinner />)
  const [activeStory, setActiveStory] = useState('game')
  const [activePanel, setActivePanel] = useState('home')
  const [battle, setBattle] = useState(null)

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
                  <p className="error-message">{errorMessage}</p>
                )}
                <p>Попробуй еще раз</p>
              </Alert>
            )
          }
          return event
        },
      })
    }
    initTracker()
  }, [])

  async function fetchUser() {
    try {
      const fetchedUser = await AppService.fetchUserData()
      setUser(fetchedUser)
    } finally {
      setPopout(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const onFinishGame = async (localBattle: GameInstance) => {
    const updatedBattle = await BattleService.getBattle(localBattle.id)
    setBattle(updatedBattle)
    setActivePanel('results')
    reachGoal('finish-game')
    fetchUser()
  }

  const goToHomePanel = () => setActivePanel('home')

  const onStartBattle = () => {
    setActivePanel('battle')
    reachGoal('start-game')
  }

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        <Tabbar>
          <TabbarItem
            text="Игра"
            selected={activeStory === 'game'}
            onClick={() => {
              setActiveStory('game')
              setActivePanel('home')
            }}
          >
            <Icon28Game />
          </TabbarItem>
          <TabbarItem
            text="Рейтинг"
            selected={activeStory === 'scoreboard'}
            onClick={() => {
              setActiveStory('scoreboard')
              setActivePanel('scoreboard-home')
            }}
          >
            <Icon28UsersOutline />
          </TabbarItem>
        </Tabbar>
      }
    >
      <View id="game" activePanel={activePanel} popout={popout}>
        <Panel id="home">
          <Home user={user} onStartBattle={onStartBattle} />
        </Panel>
        <Panel id="battle">
          <Battle
            onGoBack={goToHomePanel}
            user={user}
            onFinishGame={onFinishGame}
          />
        </Panel>
        <Panel id="results">
          <Results
            onRetry={onStartBattle}
            onGoBack={goToHomePanel}
            battle={battle}
          />
        </Panel>
      </View>
      <View id="scoreboard" activePanel={activePanel} popout={popout}>
        <Panel id="scoreboard-home">scoreboard</Panel>
      </View>
    </Epic>
  )
}

export default App
