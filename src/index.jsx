import 'core-js/features/map'
import 'core-js/features/set'
import React from 'react'
import ReactDOM from 'react-dom'
import bridge from '@vkontakte/vk-bridge'
import App from './App'
import { Utils } from './Utils'

// Init VK  Mini App
bridge.send('VKWebAppInit')

ReactDOM.render(<App />, document.getElementById('root'))
if (!Utils.isProductionMode) {
  // eslint-disable-next-line no-unused-expressions
  import('./eruda')
}
