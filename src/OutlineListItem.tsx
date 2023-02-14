import { styled } from '@stitches/react'
import { useRef, useCallback, useState } from 'react'
import { useResumableTimers } from './atoms/resumableTimer'
import { Icon } from './components/ui/icon/Icon'
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

  const finishProgress = (e: React.MouseEvent) => {
    e.preventDefault()
    finish(item.blockId)
    progressAnimation?.finish()
  }

  return (
    <StyledOutlineListItem key={item.blockId} ref={ref} playing={!!timer}>
      <StyledOutlineItem
        href={`${location.pathname}#${item.blockId.replaceAll('-', '')}`}
        level={item.level}
      >
        {item.textContent}
      </StyledOutlineItem>
      {duration !== null && (
        <StyledOutlineActionContainer>
          {timer?.state === 'running' ? (
            <>
              <Icon icon="pause-circle" color="rgba(203, 145, 47, 1)" onClick={pauseProgress} />
              <Icon icon="stop-circle" color="rgba(212, 76, 71, 1)" onClick={finishProgress} />
            </>
          ) : (
            <Icon
              icon="play-circle"
              color="rgba(68, 131, 97, 1)"
              onClick={timer ? resumeProgress : startProgress}
            />
          )}
        </StyledOutlineActionContainer>
      )}
    </StyledOutlineListItem>
  )
}

const StyledOutlineActionContainer = styled('div', {
  opacity: 0,
  display: 'flex',
  columnGap: 4,
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
