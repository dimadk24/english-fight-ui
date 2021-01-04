import React, { useEffect, useState } from 'react'
import View from '@vkontakte/vkui/dist/components/View/View'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert'
import '@vkontakte/vkui/dist/vkui.css'

import Home from './panels/Home'
import { AppService } from './AppService'
import Battle from './panels/Battle'
import './constant-styles.css'
import Results from './panels/Results'
import { BattleService } from './panels/BattleService'
import { Utils } from '../Utils'
import * as Sentry from '@sentry/react'
import './App.css'

const App = (): JSX.Element => {
  const [activePanel, setActivePanel] = useState('home')
  const [fetchedUser, setUser] = useState(null)
  const [popout, setPopout] = useState(<ScreenSpinner />)
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
      Utils.initMetrika()
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await AppService.fetchUserData()
        setUser(user)
      } finally {
        setPopout(null)
      }
    }
    fetchData()
  }, [battle])

  const onFinishGame = async (localBattle) => {
    const updatedBattle = await BattleService.getBattle(localBattle.id)
    setBattle(updatedBattle)
    setActivePanel('results')
  }

  const goBack = () => setActivePanel('home')

  const onStartBattle = () => setActivePanel('battle')

  return (
    <View activePanel={activePanel} popout={popout}>
      <Home id="home" fetchedUser={fetchedUser} onStartBattle={onStartBattle} />
      <Battle
        id="battle"
        onGoBack={goBack}
        user={fetchedUser}
        onFinishGame={onFinishGame}
      />
      <Results
        id="results"
        onGoBack={goBack}
        onRetry={onStartBattle}
        battle={battle}
      />
    </View>
  )
}

export default App
