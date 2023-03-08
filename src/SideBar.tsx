import { ComponentProps, useEffect, useMemo, useState } from 'react'
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
import { Icon } from './components/ui/icon/Icon'
import { useMouseMove } from './hooks/useMouseMove'

export const SideBar = () => {
  const { outline, setOutline } = useOutline()
  const [fixed, setFixed] = useState(true)
  const [sidebarHovered, setSidebarHovered] = useState(false)

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

  const { distanceFromRight } = useMouseMove(document.documentElement)
  const state = useMemo<ComponentProps<typeof StyledSideBarContainer>['state']>(() => {
    if (fixed) return 'fixed'
    const touchRightOfWindow = distanceFromRight <= 32
    return sidebarHovered || touchRightOfWindow ? 'floatingOpened' : 'floatingClosed'
  }, [distanceFromRight, fixed, sidebarHovered])

  const handleToggleOpened = () => {
    setFixed((prev) => !prev)
  }

  return (
    <StyledSideBarContainer
      state={state}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <StyledSideBar>
        <StyledSidebarHeader>
          <StyledSidebarTitle>Outline</StyledSidebarTitle>
          <StyledSideBarAction onClick={handleToggleOpened}>
            <Icon icon={fixed ? 'chevron-left' : 'thumbtack'} color={'rgba(55, 53, 47, 0.45)'} />
          </StyledSideBarAction>
        </StyledSidebarHeader>
        <StyledSideBarContent>
          <OutlineList outlineList={filteredHeadingList} />
        </StyledSideBarContent>
      </StyledSideBar>
    </StyledSideBarContainer>
  )
}

const StyledSideBarAction = styled('div', {
  cursor: 'pointer',
  width: 24,
  height: 24,
  display: 'inline-flex',
  borderRadius: 3,
  opacity: 0,
  userSelect: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '20ms ease-in 0s, opacity 100ms ease-in 0s',
  '&:hover': {
    background: 'rgba(55, 53, 47, 0.08)',
  },
})

const StyledSideBar = styled('section', {
  minWidth: 260,
  width: 260,
  padding: '4px 14px',
  position: 'absolute',
  top: 0,
  right: 0,
  '&:hover': {
    [`& ${StyledSideBarAction}`]: {
      opacity: 1,
    },
  },
})

const StyledSidebarHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 4,
  paddingBottom: 4,
})

const StyledSidebarTitle = styled('div', {
  fontWeight: 500,
  fontSize: 14,
  whiteSpace: 'pre-wrap',
})

const StyledSideBarContent = styled('div', {})

const StyledSideBarContainer = styled('div', {
  maxHeight: 'calc(10vh - 120px)',
  position: 'relative',
  borderTopLeftRadius: 3,
  borderBottomLeftRadius: 3,
  transitionDuration: '300ms',
  paddingLeft: 32,
  variants: {
    state: {
      fixed: {
        transform: 'translate(0, 0)',
        opacity: 1,
      },
      floatingOpened: {
        transform: 'translate(0, 8px)',
        opacity: 1,
        [`& ${StyledSideBar}`]: {
          boxShadow:
            'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px',
        },
      },
      floatingClosed: {
        transform: 'translate(260px, 8px)',
        opacity: 0,
        [`& ${StyledSideBar}`]: {
          boxShadow:
            'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px',
        },
      },
    },
  },
})
