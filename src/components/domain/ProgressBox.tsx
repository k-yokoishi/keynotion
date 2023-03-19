import { styled } from '@stitches/react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as RadixProgress from '@radix-ui/react-progress'
import { ResumableTimer } from '../../atoms/resumableTimer'
import { getMilliseconds } from '../../utils/datetime'
import { TimerAction } from '../../TimerAction'

type OutlineItem = {
  blockId: string
  textContent: string
}
type Props = {
  item: OutlineItem
  timer?: ResumableTimer
  onFinish: (blockId: string) => void
}

export const ProgressBox: FC<Props> = ({ item, timer, onFinish }) => {
  const ref = useRef<HTMLDivElement>(null)

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
            transform: 'translateX(-100%)',
            backgroundColor: 'rgb(51, 126, 169)',
          },
          {
            backgroundColor: 'rgb(51, 126, 169)',
            offset: 0.65,
          },
          {
            backgroundColor: 'rgb(203, 145, 47)',
            offset: 0.7,
          },
          {
            backgroundColor: 'rgb(203, 145, 47)',
            offset: 0.9,
          },
          {
            backgroundColor: 'rgb(212, 76, 71)',
            offset: 0.95,
          },
          {
            transform: 'translateX(0%)',
            backgroundColor: 'rgb(212, 76, 71)',
            offset: 1.0,
          },
        ],
        {
          duration,
          easing: 'linear',
          fill: 'forwards',
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
    console.log('timer?.state', timer?.state)
    if (timer?.state === 'running') {
      startProgress()
    } else if (timer?.state === 'paused') {
      pauseProgress()
    } else if (timer?.state === 'finished') {
      finishProgress()
    }
  }, [finishProgress, item.blockId, pauseProgress, startProgress, timer?.state])

  return (
    <StyledProgressBox>
      {timer && (
        <StyledTimerActionWrapper>
          <TimerAction
            state={timer.state}
            onStart={startProgress}
            onPause={pauseProgress}
            onStop={() => onFinish(item.blockId)}
          />
        </StyledTimerActionWrapper>
      )}
      <StyledProgressBoxTitle>{item.textContent}</StyledProgressBoxTitle>
      <StyledProgressRoot>
        <StyledProgressIndicator ref={ref} />
      </StyledProgressRoot>
    </StyledProgressBox>
  )
}

const StyledTimerActionWrapper = styled('div', {
  position: 'absolute',
  opacity: 0,
  top: 8,
  right: 10,
  backgroundColor: 'White',
  padding: '4px 6px',
  borderRadius: 3,
  boxShadow: 'rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px',
  transitionDuration: '300ms',
})

const StyledProgressBox = styled('div', {
  position: 'relative',
  padding: 8,
  borderRadius: 3,
  backgroundColor: 'White',
  width: 200,
  boxShadow:
    'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px',
  '&:hover': {
    [`${StyledTimerActionWrapper}`]: {
      opacity: 1,
    },
  },
})

const StyledProgressBoxTitle = styled('div', {
  fontSize: 14,
  marginBottom: 8,
  overflow: 'hidden',
  display: '-webkit-box',
  '-webkit-line-clamp': 2,
  '-webkit-box-orient': 'vertical',
})

const StyledProgressRoot = styled(RadixProgress.Root, {
  overflow: 'hidden',
  height: 10,
  borderRadius: 3,
  backgroundColor: 'rgb(241, 241, 239)',
})

const StyledProgressIndicator = styled(RadixProgress.Indicator, {
  width: '100%',
  height: '100%',
  transitionDuration: '17ms',
})
