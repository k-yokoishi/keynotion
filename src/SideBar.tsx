import { useEffect } from 'react'
import { styled } from '@stitches/react'
import {
  getBlockInfo,
  getHeaderBlockElements,
  getHeaderLevel,
  getNotionAppElement,
  getPageContentElement,
} from './utils/notion'
import { OutlineList } from './OutlineList'
import { useOutline } from './atoms/outline'

export const SideBar = () => {
  const { outline, setOutline } = useOutline()

  const initializeHeadingList = () => {
    const pageContent = getPageContentElement(document)
    if (pageContent === null) return

    const headerEls = Array.from(getHeaderBlockElements(document))
    const headingList = headerEls.map((el) => ({
      blockId: getBlockInfo(el).id,
      level: getHeaderLevel(el) ?? 1,
      textContent: el.innerText,
    }))
    setOutline(headingList)
  }

  const filteredHeadingList = outline.filter((heading) => heading.textContent !== '')
  useEffect(() => {
    initializeHeadingList()
    const notionApp = getNotionAppElement(document)
    if (notionApp === null) return
    // TODO: Finely update each heading item
    const observer = new MutationObserver(initializeHeadingList)
    observer.observe(notionApp, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [])

  return (
    <StyledSideBar>
      <StyledOutlineHeader>
        <StyledOutlineHederTitle>Outline</StyledOutlineHederTitle>
      </StyledOutlineHeader>
      <OutlineList outlineList={filteredHeadingList} />
    </StyledSideBar>
  )
}

const StyledSideBar = styled('div', {
  paddingLeft: 16,
  minWidth: 260,
  width: 260,
  position: 'absolute',
  top: 0,
  right: 0,
})

const StyledOutlineHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: 4,
})
const StyledOutlineHederTitle = styled('div', {
  fontWeight: 500,
  fontSize: 14,
  whiteSpace: 'pre-wrap',
})
