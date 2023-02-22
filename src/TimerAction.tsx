import { styled } from '@stitches/react'
import { TimerState } from './atoms/resumableTimer'
import { Icon } from './components/ui/icon/Icon'

type Props = {
  state: TimerState
  onStart: () => void
  onPause: () => void
  onStop: () => void
}

export const TimerAction: React.FC<Props> = ({ state, onStart, onPause, onStop }) => {
  return (
    <TimerActionContainer>
      {state === 'running' ? (
        <>
          <Icon icon="pause-circle" color="rgba(203, 145, 47, 1)" onClick={onPause} />
          <Icon icon="stop-circle" color="rgba(212, 76, 71, 1)" onClick={onStop} />
        </>
      ) : (
        <Icon icon="play-circle" color="rgba(68, 131, 97, 1)" onClick={onStart} />
      )}
    </TimerActionContainer>
  )
}

const TimerActionContainer = styled('div', {
  display: 'flex',
  columnGap: 4,
  transitionDuration: '300ms',
})
