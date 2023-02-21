import { PropsWithChildren, useEffect } from 'react'
import { useSetOutline } from './atoms/outline'
import { getMilliseconds } from './utils/datetime'
import {
  findParentBlock,
  getBlockElements,
  getHeaderLevel,
  getPageContentElement,
} from './utils/notion'

export const App: React.FC<PropsWithChildren> = ({ children }) => {
  const setOutline = useSetOutline()
  const initializeHeadingList = () => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headerEls = Array.from(getBlockElements(document) ?? []).filter((el) =>
      getHeaderLevel(el)
    )
    const headingList = headerEls.map((el) => ({
      blockId: el.getAttribute('data-block-id')!,
      level: getHeaderLevel(el)!,
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
