import React, { useEffect, useState } from 'react'
import bridge from '@vkontakte/vk-bridge'
import View from '@vkontakte/vkui/dist/components/View/View'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import '@vkontakte/vkui/dist/vkui.css'

import Home from './panels/Home'
import { AppService } from './AppService'
import Battle from './panels/Battle'
import './constant-styles.css'
import Results from './panels/Results'
import { BattleService } from './panels/BattleService'

const App = () => {
  const [activePanel, setActivePanel] = useState('home')
  const [fetchedUser, setUser] = useState(null)
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />)
  const [battle, setBattle] = useState(null)

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme')
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light'
        document.body.attributes.setNamedItem(schemeAttribute)
      }
    })
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
