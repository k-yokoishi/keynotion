import { ComponentProps, memo, useCallback, useEffect, useState } from 'react'
import { useSetOutline } from './atoms/outline'
import { ProgressController } from './components/domain/ProgressController'
import { EmbeddedTimerAction } from './EmbeddedTimerAction'
import { MousePointer } from './MousePointer'
import { SettingRepository } from './repositories/settingRepository'
import { addListenerOnUpdateSetting } from './services/messageService'
import { SideBar } from './SideBar'
import {
  getBlockInfo,
  getHeaderBlockElements,
  getHeaderLevel,
  getNotionAppElement,
} from './utils/notion'

export const App: React.FC = () => {
  const setOutline = useSetOutline()
  const updateOutlineValues = useCallback(() => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headingList = getHeaderBlockElements(document).map((el) => ({
      blockId: getBlockInfo(el).id,
      level: getHeaderLevel(el) ?? 1,
      textContent: el.innerText,
    }))
    setOutline(headingList)
  }, [setOutline])

  useEffect(() => {
    updateOutlineValues()

    const notionApp = getNotionAppElement(document)
    if (notionApp === null) return
    const observer = new MutationObserver(updateOutlineValues)
    observer.observe(notionApp, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [updateOutlineValues])

  addListenerOnUpdateSetting((setting) => {
    setLasersPointerEnabled(setting.laserPointerEnabled)
  })
  const [laserPointerEnabled, setLasersPointerEnabled] = useState(false)

  useEffect(() => {
    new SettingRepository().getLaserPointerEnabled().then(setLasersPointerEnabled)
  }, [])

  const MousePointerMemo = memo(function MousePointerMemo({
    enabled,
  }: ComponentProps<typeof MousePointer>) {
    return <MousePointer enabled={enabled} />
  })

  return (
    <>
      <MousePointerMemo enabled={laserPointerEnabled} />
      <EmbeddedTimerAction />
      <SideBar />
      <ProgressController />
    </>
  )
}
