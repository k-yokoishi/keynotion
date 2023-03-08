import { PropsWithChildren, useCallback, useEffect } from 'react'
import { useSetOutline } from './atoms/outline'
import {
  getBlockInfo,
  getHeaderBlockElements,
  getHeaderLevel,
  getNotionAppElement,
} from './utils/notion'

export const App: React.FC<PropsWithChildren> = ({ children }) => {
  const setOutline = useSetOutline()
  const initializeHeadingList = useCallback(() => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headerEls = getHeaderBlockElements(document)
    const headingList = Array.from(headerEls).map((el) => ({
      blockId: getBlockInfo(el).id,
      level: getHeaderLevel(el) ?? 1,
      textContent: el.innerText,
    }))
    setOutline(headingList)
  }, [setOutline])

  useEffect(() => {
    initializeHeadingList()

    const notionApp = getNotionAppElement(document)
    if (notionApp === null) return
    // TODO: Finely update each heading item
    const observer = new MutationObserver(initializeHeadingList)
    observer.observe(notionApp, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [initializeHeadingList])

  return <>{children}</>
}
