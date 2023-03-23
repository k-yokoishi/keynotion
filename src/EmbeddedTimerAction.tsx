import { useEffect, useState } from 'react'
import { getBlockInfo, getHeaderLevel } from './utils/notion'
import { createPortal } from 'react-dom'
import { TimerAction } from './TimerAction'
import { useResumableTimers } from './atoms/resumableTimer'
import { isElement } from './utils/dom'
import { getMilliseconds } from './utils/datetime'
import { styled } from './styles/theme'

type TimerAction = {
  blockId: string
  el: Element
}

type HoveredHeadingPosition = { x: number; y: number } | null

export const EmbeddedTimerAction: React.FC = () => {
  const { timers, start, finish } = useResumableTimers()
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
      const hoveredHeaderBlockElWithTime = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((el) => isElement(el) && getHeaderLevel(el) && getMilliseconds(el.innerText))

      if (hoveredHeaderBlockElWithTime && isElement(hoveredHeaderBlockElWithTime)) {
        setHoveredHeading({
          el: hoveredHeaderBlockElWithTime,
          blockId: getBlockInfo(hoveredHeaderBlockElWithTime).id,
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
  padding: '4px 6px',
  borderRadius: '$base',
  boxShadow: '$shallow',
})
