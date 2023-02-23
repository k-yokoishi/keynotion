import { PropsWithChildren, useEffect } from 'react'
import { useSetOutline } from './atoms/outline'
import {
  getBlockElements,
  getBlockInfo,
  getHeaderBlockElements,
  getHeaderLevel,
  getPageContentElement,
} from './utils/notion'

export const App: React.FC<PropsWithChildren> = ({ children }) => {
  const setOutline = useSetOutline()
  const initializeHeadingList = () => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headerEls = getHeaderBlockElements(document)
    const headingList = Array.from(headerEls).map((el) => ({
      blockId: getBlockInfo(el).id,
      level: getHeaderLevel(el) ?? 1,
      textContent: el.innerText,
    }))
    setOutline(headingList)
  }

  useEffect(() => {
    initializeHeadingList()

    const pageContent = getPageContentElement(document)
    if (pageContent === null) return
    // TODO: Finely update each heading item
    const observer = new MutationObserver(initializeHeadingList)
    observer.observe(pageContent, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
