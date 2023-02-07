import { useEffect, useState } from 'react'
import { styled } from '@stitches/react'
import { findParentBlock, getHeaderLevel, HeaderLevel, isHeaderBlock } from './utils/notion'

type Heading = {
  id: string
  level: HeaderLevel
  textContent: string
}

export const SideBar = () => {
  const [headingList, setHeadingList] = useState<Heading[]>([])

  const getMutationType = (mutation: MutationRecord) => {}

  const onUpdateContent: MutationCallback = (mutations) => {
    for (const mutation of mutations) {
      const isCharacterAddition = mutation.type === 'characterData'
      const isCharacterDeletion = mutation.type === 'childList'
      console.log('mutation', mutation)
      if (isCharacterAddition || isCharacterDeletion) {
        const headerEl = findParentBlock(mutation.target)
        if (!headerEl) return
        if (!isHeaderBlock(headerEl)) return

        const dataBlockId = headerEl?.getAttribute('data-block-id')
        setHeadingList((prev) =>
          prev.map((heading) =>
            heading.id === dataBlockId
              ? { ...heading, textContent: headerEl?.innerText ?? '' }
              : heading
          )
        )
      }
    }
  }
  useEffect(() => {
    setHeadingList([])
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return
    pageContent.querySelectorAll<HTMLDivElement>('[data-block-id]').forEach((el) => {
      const level = getHeaderLevel(el)
      if (level === null) return
      setHeadingList((prev) => [
        ...prev,
        { id: el.getAttribute('data-block-id')!, level: level, textContent: el.innerText },
      ])
    })
    const observer = new MutationObserver(onUpdateContent)
    observer.observe(pageContent, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [])
  return (
    <StyledSideBar>
      <StyledOutlineHeader>
        <StyledOutlineHederTitle>Outline</StyledOutlineHederTitle>
      </StyledOutlineHeader>
      <StyledOutlineList>
        {headingList.map((heading) => (
          <li key={heading.id}>
            <StyledOutlineItem
              css={{
                paddingLeft: (heading.level - 1) * 12 + 8,
              }}
            >
              {heading.textContent}
            </StyledOutlineItem>
          </li>
        ))}
      </StyledOutlineList>
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
const StyledOutlineHederTitle = styled('div', { fontWeight: 500, fontSize: 14 })

const StyledOutlineList = styled('ul', {
  listStyle: 'none',
  marginBlockStart: 0,
  marginBlockEnd: 0,
  paddingInlineStart: 0,
})

const StyledOutlineItem = styled('button', {
  backgroundColor: 'transparent',
  border: 'none',
  transitionDuration: '300ms',
  width: '100%',
  fontSize: '0.875rem',
  color: 'rgb(120, 119, 116)',
  padding: '4px 8px',
  textAlign: 'left',
  '&:hover': {
    backgroundColor: 'rgb(241, 241, 239)',
  },
})
