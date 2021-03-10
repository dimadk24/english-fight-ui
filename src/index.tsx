import 'core-js/features/map'
import 'core-js/features/set'
import React from 'react'
import { render as renderReact } from 'react-dom'
import bridge from '@vkontakte/vk-bridge'
import { Utils } from './Utils'
import { ErrorBoundary } from './components/ErrorBoundary'
import AppWrapper from './components/AppWrapper'

// Init VK  Mini App
bridge.send('VKWebAppInit')

bridge.subscribe(({ detail: { type, data } }) => {
  if (type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme')
    // @ts-ignore
    schemeAttribute.value = data.scheme || 'client_light'
    document.body.attributes.setNamedItem(schemeAttribute)
  }
})

function render() {
  renderReact(
    <React.StrictMode>
      <ErrorBoundary>
        <AppWrapper />
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
render()

if (!Utils.isProductionMode) {
  if (module.hot) {
    module.hot.accept('./components/App', render)
  }

  import('./eruda')
}
