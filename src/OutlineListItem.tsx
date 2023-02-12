import { styled } from '@stitches/react'
import { useRef, useCallback, useState } from 'react'
import { useResumableTimers } from './atoms/resumableTimer'
import { getMilliseconds } from './utils/datetime'
import { HeaderLevel } from './utils/notion'

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
}

type Props = {
  item: OutlineItem
}

export const OutlineListItem: React.FC<Props> = ({ item }) => {
  const ref = useRef<HTMLLIElement>(null)

  const { timers, start, pause, finish } = useResumableTimers()
  const timer = timers.find((timer) => timer.key === item.blockId)
  const duration = getMilliseconds(item.textContent)
  const [progressAnimation, setProgressAnimation] = useState<Animation | null>(null)

  const resumeProgress = (e: React.MouseEvent) => {
    e.preventDefault()
    start(item.blockId)
    progressAnimation?.play()
  }

  const startProgress = (e: React.MouseEvent) => {
    e.preventDefault()

    if (ref === null || ref.current === null || duration === null) return
    start(item.blockId)
    const animation = ref.current.animate(
      [
        {
          backgroundPosition: '100%',
          backgroundSize: '200% 100%',
        },
        {
          backgroundPosition: '0%',
          backgroundSize: '200% 100%',
        },
      ],
      {
        duration,
        easing: 'linear',
      }
    )
    setProgressAnimation(animation)
    animation.onfinish = () => {
      finish(item.blockId)
      setProgressAnimation(null)
    }
  }

  const pauseProgress = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      pause(item.blockId)
      progressAnimation?.pause()
    },
    [item.blockId, pause, progressAnimation]
  )

  return (
    <StyledOutlineListItem key={item.blockId} ref={ref} playing={!!timer}>
      <StyledOutlineItem
        href={`${location.pathname}#${item.blockId.replaceAll('-', '')}`}
        level={item.level}
      >
        {item.textContent}
      </StyledOutlineItem>
      {duration !== null &&
        (timer?.state === 'running' ? (
          <TimerAction onClick={pauseProgress}>pause</TimerAction>
        ) : (
          <TimerAction onClick={timer ? resumeProgress : startProgress}>play</TimerAction>
        ))}
    </StyledOutlineListItem>
  )
}

const TimerAction = styled('button', {
  opacity: 0,
  fontSize: 10,
  padding: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  border: 'none',
})

const StyledOutlineListItem = styled('li', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 8px',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgb(241, 241, 239)',

    [`& ${TimerAction}`]: {
      opacity: 1,
    },
  },
  variants: {
    playing: {
      true: {
        background:
          'linear-gradient(to right, rgb(72, 216, 177) 0 50%, rgb(203, 242, 239) 50% 100%)',
      },
    },
  },
})

const StyledOutlineItem = styled('a', {
  transitionDuration: '300ms',
  textDecoration: 'none',
  whiteSpace: 'pre',
  cursor: 'pointer',
  width: '100%',
  fontSize: '0.875rem',
  color: 'rgb(120, 119, 116)',
  backgroundColor: 'transparent',
  variants: {
    level: {
      1: {
        paddingLeft: 8,
      },
      2: {
        paddingLeft: 8 + 12,
      },
      3: {
        paddingLeft: 8 + 20,
      },
    },
  },
})
