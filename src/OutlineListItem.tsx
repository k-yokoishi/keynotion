import { styled } from '@stitches/react'
import { useRef, useCallback, useState, useEffect } from 'react'
import { ResumableTimer } from './atoms/resumableTimer'
import { TimerAction } from './TimerAction'
import { getMilliseconds } from './utils/datetime'
import { HeaderLevel } from './utils/notion'

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
}

type Props = {
  item: OutlineItem
  timer?: ResumableTimer
  onStart: (blockId: string) => void
  onPause: (blockId: string) => void
  onFinish: (blockId: string) => void
}

export const OutlineListItem: React.FC<Props> = ({ item, timer, onStart, onPause, onFinish }) => {
  const ref = useRef<HTMLLIElement>(null)

  const duration = getMilliseconds(item.textContent)
  const [progressAnimation, setProgressAnimation] = useState<Animation | null>(null)

  const startProgress = useCallback(() => {
    if (ref === null || ref.current === null || duration === null) return
    if (progressAnimation) {
      progressAnimation.play()
    } else {
      const animation = ref.current.animate(
        [
          {
            backgroundPosition: '100%',
          },
          {
            backgroundPosition: '0%',
          },
        ],
        {
          duration,
          easing: 'linear',
        }
      )
      setProgressAnimation(animation)
      animation.onfinish = () => {
        onFinish(item.blockId)
        setProgressAnimation(null)
      }
    }
  }, [duration, item.blockId, onFinish, progressAnimation])

  const pauseProgress = useCallback(() => {
    progressAnimation?.pause()
  }, [progressAnimation])

  const finishProgress = useCallback(() => {
    progressAnimation?.finish()
  }, [progressAnimation])

  useEffect(() => {
    if (timer?.state === 'running') {
      startProgress()
    } else if (timer?.state === 'paused') {
      pauseProgress()
    } else if (timer?.state === 'finished') {
      finishProgress()
    }
  }, [finishProgress, item.blockId, pauseProgress, startProgress, timer?.state])

  return (
    <StyledOutlineListItem key={item.blockId} ref={ref} playing={!!timer}>
      <StyledOutlineItem
        href={`${location.pathname}#${item.blockId.replaceAll('-', '')}`}
        level={item.level}
      >
        {item.textContent}
      </StyledOutlineItem>
      {duration && (
        <StyledOutlineActionContainer>
          <TimerAction
            state={timer?.state ?? 'paused'}
            onStart={() => onStart(item.blockId)}
            onPause={() => onPause(item.blockId)}
            onStop={() => onFinish(item.blockId)}
          />
        </StyledOutlineActionContainer>
      )}
    </StyledOutlineListItem>
  )
}

const StyledOutlineActionContainer = styled('div', {
  opacity: 0,
  transitionDuration: '300ms',
})

const StyledOutlineListItem = styled('li', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: 4,
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgb(241, 241, 239)',

    [`& ${StyledOutlineActionContainer}`]: {
      opacity: 1,
    },
  },
  variants: {
    playing: {
      true: {
        background:
          'linear-gradient(to right, rgb(72, 216, 177) 0 50%, rgb(203, 242, 239) 50% 100%)',
        backgroundPosition: '0%',
        backgroundSize: '200% 100%',
      },
    },
  },
})

const StyledOutlineItem = styled('a', {
  transitionDuration: '300ms',
  textDecoration: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  width: '100%',
  fontSize: '0.875rem',
  color: 'rgb(120, 119, 116)',
  backgroundColor: 'transparent',
  variants: {
    level: {
      1: {
        paddingLeft: 0,
      },
      2: {
        paddingLeft: 12,
      },
      3: {
        paddingLeft: 24,
      },
    },
  },
})
