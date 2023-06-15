import { ComponentProps, memo, useCallback, useEffect, useState } from 'react'
import { useSetOutline } from '../../atoms/outline'
import { ProgressController } from '../../components/domain/ProgressController'
import { EmbeddedTimerAction } from '../../components/domain/EmbeddedTimerAction'
import { LaserPointer } from '../../components/domain/LaserPointer'
import { SideBar } from '../../components/domain/SideBar'
import {
  getBlockInfo,
  getHeaderBlockElements,
  getHeaderLevel,
  getNotionAppElement,
} from '../../utils/notion'
import { useSetting } from '../../atoms/setting'

export const ContentScriptApp: React.FC = () => {
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

  const { setting } = useSetting()

  const MousePointerMemo = memo(function MousePointerMemo({
    enabled,
  }: ComponentProps<typeof LaserPointer>) {
    return <LaserPointer enabled={enabled} />
  })

  return (
    <>
      <div>setting:{JSON.stringify(setting)}</div>
      {setting && (
        <>
          <MousePointerMemo enabled={setting.laserPointerEnabled} />
          <EmbeddedTimerAction />
          <SideBar enabled={setting.sideBarEnabled} initialFixed={setting.lastSideBarFixed} />
          <ProgressController />
        </>
      )}
    </>
  )
}
