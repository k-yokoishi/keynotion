import React from 'react'
import { createRoot } from 'react-dom/client'
import { SideBar } from './SideBar'
import { initialize } from './components/ui/icon/Icon'
import { App } from './App'
import { EmbeddedTimerAction } from './EmbeddedTimerAction'
import { MousePointer } from './MousePointer'

initialize()

const appContainer = document.createElement('div')
appContainer.id = 'kn-root'

document.documentElement.appendChild(appContainer)
const root = createRoot(appContainer)

root.render(
  <React.StrictMode>
    <App>
      <MousePointer />
      <EmbeddedTimerAction />
      <SideBar />
    </App>
  </React.StrictMode>
)
