import { ResumableTimer } from './atoms/resumableTimer'
import { styled } from './styles/theme'
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
  onFinish: (blockId: string) => void
}

export const OutlineListItem: React.FC<Props> = ({ item, timer, onStart, onFinish }) => {
  const duration = getMilliseconds(item.textContent)

  return (
    <StyledOutlineListItem key={item.blockId}>
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
