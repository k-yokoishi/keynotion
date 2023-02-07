import { useEffect, useState } from 'react'
import { styled } from '@stitches/react'
import { getHeaderLevel, HeaderLevel } from './utils/notion'

type Heading = {
  id: string
  level: HeaderLevel
  textContent: string
}

export const SideBar = () => {
  const [headingList, setHeadingList] = useState<Heading[]>([])

  const initializeHeadingList = () => {
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return

    const headingList: Heading[] = Array.from(
      pageContent.querySelectorAll<HTMLDivElement>('[data-block-id]')
    )
      .filter((el) => getHeaderLevel(el))
      .map((el) => ({
        id: el.getAttribute('data-block-id')!,
        level: getHeaderLevel(el)!,
        textContent: el.innerText,
      }))
    setHeadingList(headingList)
  }

  const filteredHeadingList = headingList.filter((heading) => heading.textContent !== '')
  useEffect(() => {
    initializeHeadingList()
    const pageContent = document.querySelector('div.notion-page-content')
    if (pageContent === null) return
    // TODO: Finely update each heading item
    const observer = new MutationObserver(initializeHeadingList)
    observer.observe(pageContent, { characterData: true, subtree: true, childList: true })
    return () => observer.disconnect()
  }, [])
  return (
    <StyledSideBar>
      <StyledOutlineHeader>
        <StyledOutlineHederTitle>Outline</StyledOutlineHederTitle>
      </StyledOutlineHeader>
      <StyledOutlineList>
        {filteredHeadingList.map((heading) => (
          <li key={heading.id}>
            <StyledOutlineItem
              onClick={() => {
                location.hash = '#' + heading.id.replaceAll('-', '')
              }}
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
