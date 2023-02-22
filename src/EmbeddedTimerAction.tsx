import { useEffect, useMemo, useState } from 'react'
import { findParentBlock, getBlockInfo, getHeaderLevel } from './utils/notion'
import { createPortal } from 'react-dom'
import { styled } from '@stitches/react'
import { TimerAction } from './TimerAction'
import { useResumableTimers } from './atoms/resumableTimer'
import { isElement } from './utils/dom'

type TimerAction = {
  blockId: string
  el: Element
}

type HoveredHeadingPosition = { x: number; y: number } | null

export const EmbeddedTimerAction: React.FC = () => {
  const { timers, start, pause, finish } = useResumableTimers()
  const [hoveredHeading, setHoveredHeading] = useState<TimerAction | null>(null)
  const [hoveredHeadingPosition, setHoveredHeadingPosition] = useState<HoveredHeadingPosition>(null)
  const timer = timers.find((v) => v.key === hoveredHeading?.blockId)

  const updateHoveredHeadingPosition = () => {
    if (hoveredHeading === null) return
    const { x, y, width, height } = hoveredHeading.el.getBoundingClientRect()
    setHoveredHeadingPosition({
      x: x + width - 16,
      y: y + height / 2,
    })
  }

  useEffect(updateHoveredHeadingPosition, [hoveredHeading])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      //
      const hoveredHeaderBlockEl = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((el) => isElement(el) && getHeaderLevel(el))

      if (hoveredHeaderBlockEl && isElement(hoveredHeaderBlockEl)) {
        setHoveredHeading({
          el: hoveredHeaderBlockEl,
          blockId: getBlockInfo(hoveredHeaderBlockEl).id,
        })
      } else {
        setHoveredHeading(null)
      }
    }
    document.addEventListener('mousemove', onMouseMove)

    const onScroll = () => updateHoveredHeadingPosition()

    const scroller = document.querySelector('.notion-frame > .notion-scroller')
    scroller?.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      scroller?.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <>
      {hoveredHeading &&
        hoveredHeadingPosition !== null &&
        createPortal(
          <TimerActionContainer
            css={{
              top: hoveredHeadingPosition.y,
              left: hoveredHeadingPosition.x,
            }}
          >
            <TimerAction
              state={timer?.state ?? 'paused'}
              onStart={() => start(hoveredHeading.blockId)}
              onPause={() => pause(hoveredHeading.blockId)}
              onStop={() => finish(hoveredHeading.blockId)}
            />
          </TimerActionContainer>,
          document.body
        )}
    </>
  )
}

const TimerActionContainer = styled('div', {
  position: 'absolute',
  zIndex: 100,
  transform: 'translate(-100%, -50%)',
  backgroundColor: 'White',
  padding: 8,
  borderRadius: 8,
  boxShadow: '0 0 8px lightgray',
  // opacity: 0.8,
})
