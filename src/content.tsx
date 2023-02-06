import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './content.css'
import { SideBar } from './SideBar'

const frame = document.getElementsByClassName('notion-frame')[0]

if (!frame) {
  console.warn('notion-frame not found.')
}
const appContainer = document.createElement('div')
appContainer.classList.add('SideBar_container')
appContainer.id = 'crx-root'
frame.prepend(appContainer)
const root = createRoot(appContainer)

root.render(
  <React.StrictMode>
    <SideBar />
  </React.StrictMode>
)
