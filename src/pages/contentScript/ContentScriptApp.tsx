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
  getNotionScroller,
} from '../../utils/notion'
import { useSetting } from '../../atoms/setting'

export const ContentScriptApp: React.FC = () => {
  const setOutline = useSetOutline()
  const updateOutlineValues = useCallback(() => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headerBlockElements = getHeaderBlockElements(document)
    const topOfHeaderBlockElements = headerBlockElements.map((el) => el.getBoundingClientRect().top)
    const topOffset = 120
    const headingList = headerBlockElements.map((el, i) => ({
      blockId: getBlockInfo(el).id,
      level: getHeaderLevel(el) ?? 1,
      textContent: el.innerText,
      currentlyViewed: i === headerBlockElements.length - 1 ? topOfHeaderBlockElements[i] < topOffset : topOfHeaderBlockElements[i] < topOffset && topOfHeaderBlockElements[i+1] > topOffset,
    }))
    setOutline(headingList)
  }, [setOutline])

  useEffect(() => {
    updateOutlineValues()

    const notionApp = getNotionAppElement(document)
    if (notionApp === null) return

    const observer = new MutationObserver(updateOutlineValues)
    observer.observe(notionApp, { characterData: true, subtree: true, childList: true })

    const scroller = getNotionScroller(document)
    if (scroller) {
      scroller.addEventListener('scroll', updateOutlineValues)
    }

    return () => {
      observer.disconnect()
      if (scroller) {
        scroller.removeEventListener('scroll', updateOutlineValues)
      }
    }
  }, [updateOutlineValues])

  const { setting } = useSetting()

  const MousePointerMemo = memo(function MousePointerMemo({
    enabled,
  }: ComponentProps<typeof LaserPointer>) {
    return <LaserPointer enabled={enabled} />
  })

  return (
    <>
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
