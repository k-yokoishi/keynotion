import { styled } from '@stitches/react'
import { ComponentProps, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useOutlineValue } from '../../atoms/outline'
import { useDocument } from '../../hooks/useDocument'
import { useMouseMove } from '../../hooks/useMouseMove'
import { getNotionFrameElement, getProgressBarElement } from '../../utils/notion'
import { Icon } from '../ui/icon/Icon'
import { OutlineList } from './OutlineList'
import { SettingRepository } from '../../repositories/settingRepository'

const SideBarWidth = '260px'

export const SideBar: React.FC<{ enabled: boolean; initialFixed: boolean }> = ({
  enabled,
  initialFixed,
}) => {
  const outline = useOutlineValue()
  const [fixed, setFixed] = useState(initialFixed)
  const [sidebarHovered, setSideBarHovered] = useState(false)
  const [rootEl, setRootEl] = useState<Element | null>(null)
  const { title, pathname } = useDocument(document)
  const { distanceFromRight } = useMouseMove(document.documentElement)
  const state = useMemo<ComponentProps<typeof StyledSideBarContainer>['state']>(() => {
    if (!enabled) return fixed ? 'fixedClosed' : 'floatingClosed'
    if (fixed) return 'fixed'
    const touchRightOfWindow = distanceFromRight <= 32
    return sidebarHovered || touchRightOfWindow ? 'floatingOpened' : 'floatingClosed'
  }, [distanceFromRight, enabled, fixed, sidebarHovered])
  const [progressBarVisible, setProgressBarVisible] = useState(false)

  useEffect(() => {
    // Wait for the notion frame element to be shown
    const observer = new MutationObserver(() => {
      const rootEl = getNotionFrameElement(document)
      if (rootEl) setRootEl(rootEl)

      setProgressBarVisible(getProgressBarElement(document) !== null)
    })
    observer.observe(document, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  const adjustScrollerWidth = useCallback((_state: typeof state) => {
    const scroller = document.querySelector<HTMLDivElement>('.notion-frame .notion-scroller')
    if (scroller === null) return
    if (_state === 'fixed' || _state === 'floatingOpened') {
      scroller.style.width = `calc(100% - ${SideBarWidth})`
    } else if (_state === 'fixedClosed' || _state === 'floatingClosed') {
      scroller.style.width = '100%'
    }
  }, [])

  useEffect(() => {
    const scroller = document.querySelector<HTMLDivElement>('.notion-frame .notion-scroller')
    if (scroller) {
      const { transitionDuration: originalTransitionDuration, width: originalWidth } =
        scroller.style
      scroller.style.transitionDuration = '300ms'
      adjustScrollerWidth(state)
      return () => {
        scroller.style.transitionDuration = originalTransitionDuration
        scroller.style.width = originalWidth
      }
    }
  }, [adjustScrollerWidth, pathname, state])

  useEffect(() => {
    adjustScrollerWidth(state)
  }, [adjustScrollerWidth, state])

  const filteredHeadingList = outline.filter((heading) => heading.textContent !== '')

  const handleToggleOpened = () => {
    setFixed((prev) => {
      const toggled = !prev
      new SettingRepository().setLastSideBarFixed(toggled)
      return toggled
    })
  }

  return (
    <>
      {rootEl &&
        !progressBarVisible &&
        createPortal(
          <StyledSideBarRoot>
            <StyledSideBarContainer
              state={state}
              onMouseEnter={() => setSideBarHovered(true)}
              onMouseLeave={() => setSideBarHovered(false)}
            >
              <StyledSideBar>
                <StyledSideBarInner>
                  <StyledSideBarHeader>
                    <StyledSideBarTitle>{title}</StyledSideBarTitle>
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
                </StyledSideBarInner>
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
  flexShrink: 0,
  display: 'inline-flex',
  borderRadius: '$base',
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
  height: 'calc(100vh - 45px)',
  overflow: 'hidden',
  borderTopLeftRadius: '$base',
  borderBottomLeftRadius: '$base',
  '&:hover': {
    [`& ${StyledSideBarAction}`]: {
      opacity: 1,
    },
  },
})

const StyledSideBarInner = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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
  // whiteSpace: 'pre-wrap',
  overflow: 'hidden',
  display: '-webkit-box',
  '-webkit-line-clamp': 2,
  '-webkit-box-orient': 'vertical',
})

const StyledSideBarContent = styled('div', {
  overflow: 'scroll',
  flex: 1,
})

const StyledSideBarRoot = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
})
const StyledSideBarContainer = styled('div', {
  maxHeight: 'calc(10vh - 120px)',
  position: 'relative',
  borderTopLeftRadius: '$base',
  borderBottomLeftRadius: '$base',
  transitionDuration: '300ms',
  paddingLeft: 32,
  variants: {
    state: {
      fixed: {
        transform: 'translate(0, 0)',
        opacity: 1,
      },
      fixedClosed: {
        transform: `translate(${SideBarWidth}, 0)`,
        opacity: 1,
      },
      floatingOpened: {
        transform: 'translate(0, 8px)',
        opacity: 1,
        [`& ${StyledSideBar}`]: {
          boxShadow: '$deep',
          height: 'calc(100vh - 45px - 16px)',
        },
      },
      floatingClosed: {
        transform: `translate(${SideBarWidth}, 8px)`,
        opacity: 0,
        [`& ${StyledSideBar}`]: {
          boxShadow: '$deep',
          height: 'calc(100vh - 45px - 16px)',
        },
      },
    },
  },
})
