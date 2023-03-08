import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { styled } from '@stitches/react'
import { getNotionFrameElement } from './utils/notion'
import { OutlineList } from './OutlineList'
import { useOutlineValue } from './atoms/outline'
import { Icon } from './components/ui/icon/Icon'
import { useMouseMove } from './hooks/useMouseMove'
import { createPortal } from 'react-dom'
import { isElement } from './utils/dom'

const SideBarWidth = '260px'

export const SideBar = () => {
  const outline = useOutlineValue()
  const [fixed, setFixed] = useState(true)
  const [sidebarHovered, setSideBarHovered] = useState(false)

  useEffect(() => {
    const scroller = document.querySelector('.notion-frame .notion-scroller')
    if (scroller && isElement(scroller)) {
      const { transitionDuration: originalTransitionDuration, width: originalWidth } =
        scroller.style
      scroller.style.transitionDuration = '300ms'
      scroller.style.width = `calc(100% - ${SideBarWidth})`
      return () => {
        scroller.style.transitionDuration = originalTransitionDuration
        scroller.style.width = originalWidth
      }
    }
    return () => {}
  }, [])

  const filteredHeadingList = outline.filter((heading) => heading.textContent !== '')

  const { distanceFromRight } = useMouseMove(document.documentElement)
  const state = useMemo<ComponentProps<typeof StyledSideBarContainer>['state']>(() => {
    if (fixed) return 'fixed'
    const touchRightOfWindow = distanceFromRight <= 32
    return sidebarHovered || touchRightOfWindow ? 'floatingOpened' : 'floatingClosed'
  }, [distanceFromRight, fixed, sidebarHovered])

  useEffect(() => {
    const scroller = document.querySelector('.notion-frame .notion-scroller')
    if (scroller === null || !isElement(scroller)) return
    if (state === 'fixed' || state === 'floatingOpened') {
      scroller.style.width = `calc(100% - ${SideBarWidth})`
      return
    } else if (state === 'floatingClosed') {
      scroller.style.width = '100%'
    }
  }, [state])

  const handleToggleOpened = () => {
    setFixed((prev) => !prev)
  }

  const rootEl = getNotionFrameElement(document)
  if (rootEl === null) throw new Error('notion-frame not found')

  return (
    <>
      {createPortal(
        <StyledSideBarRoot>
          <StyledSideBarContainer
            state={state}
            onMouseEnter={() => setSideBarHovered(true)}
            onMouseLeave={() => setSideBarHovered(false)}
          >
            <StyledSideBar>
              <StyledSideBarHeader>
                <StyledSideBarTitle>Outline</StyledSideBarTitle>
                <StyledSideBarAction onClick={handleToggleOpened}>
                  <Icon
                    icon={fixed ? 'chevron-left' : 'thumbtack'}
                    color={'rgba(55, 53, 47, 0.45)'}
                  />
                </StyledSideBarAction>
              </StyledSideBarHeader>
              <StyledSideBarContent>
                <OutlineList outlineList={filteredHeadingList} />
              </StyledSideBarContent>
            </StyledSideBar>
          </StyledSideBarContainer>
        </StyledSideBarRoot>,
        rootEl
      )}
    </>
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
  minWidth: SideBarWidth,
  width: SideBarWidth,
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

const StyledSideBarHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 4,
  paddingBottom: 4,
})

const StyledSideBarTitle = styled('div', {
  fontWeight: 500,
  fontSize: 14,
  whiteSpace: 'pre-wrap',
})

const StyledSideBarContent = styled('div', {})

const StyledSideBarRoot = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
})
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
        transform: `translate(${SideBarWidth}, 8px)`,
        opacity: 0,
        [`& ${StyledSideBar}`]: {
          boxShadow:
            'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px',
        },
      },
    },
  },
})
