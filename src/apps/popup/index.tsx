import React from 'react'
import { createRoot } from 'react-dom/client'
import { PopupApp } from './popupApp'

const appContainer = document.createElement('div')
appContainer.id = 'kn-root'

document.documentElement.appendChild(appContainer)
const root = createRoot(appContainer)

root.render(
  <React.StrictMode>
    <PopupApp></PopupApp>
  </React.StrictMode>
)
