import React from 'react'
import { createRoot } from 'react-dom/client'
import { initialize } from './components/ui/icon/Icon'
import { App } from './App'

initialize()

const appContainer = document.createElement('div')
appContainer.id = 'kn-root'

document.documentElement.appendChild(appContainer)
const root = createRoot(appContainer)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
