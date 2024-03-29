import { createRef, FC } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useOutlineValue } from '../../atoms/outline'
import { useResumableTimers } from '../../atoms/resumableTimer'
import { styled } from '../../styles/theme'
import { getNotionFrameElement } from '../../utils/notion'
import { ProgressBox } from './ProgressBox'
import './ProgressController.css'

export const ProgressController: FC = () => {
  const outlineList = useOutlineValue()

  const { timers, finish } = useResumableTimers()

  const rootEl = getNotionFrameElement(document)
  if (rootEl === null) throw new Error('notion-frame not found')
  return (
    <>
      {createPortal(
        <StyledProgressBoxRoot>
          <StyledTransitionGroup component="ul">
            {timers.reverse().map((timer) => {
              const item = outlineList.find((v) => v.blockId === timer.key)
              const nodeRef = createRef<HTMLLIElement>()
              return (
                item && (
                  <CSSTransition
                    key={item.blockId}
                    nodeRef={nodeRef}
                    timeout={200}
                    classNames="item"
                  >
                    <ProgressBoxListItem key={item.blockId} ref={nodeRef}>
                      <ProgressBox item={item} timer={timer} onFinish={finish} />
                    </ProgressBoxListItem>
                  </CSSTransition>
                )
              )
            })}
          </StyledTransitionGroup>
        </StyledProgressBoxRoot>,
        document.body
      )}
    </>
  )
}

const StyledProgressBoxRoot = styled('div', {
  position: 'absolute',
  zIndex: 999999,
  bottom: 16,
  right: 16,
})

const StyledTransitionGroup = styled(TransitionGroup, {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  rowGap: 8,
})

const ProgressBoxListItem = styled('li', {})
