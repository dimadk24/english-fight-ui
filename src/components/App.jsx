import React, { useState, useEffect } from 'react'
import bridge from '@vkontakte/vk-bridge'
import View from '@vkontakte/vkui/dist/components/View/View'
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner'
import '@vkontakte/vkui/dist/vkui.css'

import Home from './panels/Home'
import { AppService } from './AppService'
import Battle from './panels/Battle'

const App = () => {
  const [activePanel, setActivePanel] = useState('home')
  const [fetchedUser, setUser] = useState(null)
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />)

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme')
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light'
        document.body.attributes.setNamedItem(schemeAttribute)
      }
    })
    async function fetchData() {
      const user = await AppService.fetchUserData()
      setUser(user)
      setPopout(null)
    }
    fetchData()
  }, [])

  const go = (panelId) => setActivePanel(panelId)

  return (
    <View activePanel={activePanel} popout={popout}>
      <Home id="home" fetchedUser={fetchedUser} go={go} />
      <Battle id="battle" go={go} />
    </View>
  )
}

export default App
