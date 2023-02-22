import { styled } from '@stitches/react'
import { useResumableTimers } from './atoms/resumableTimer'
import { OutlineListItem } from './OutlineListItem'
import { HeaderLevel } from './utils/notion'

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
}

type Props = {
  outlineList: OutlineItem[]
}

export const OutlineList: React.FC<Props> = ({ outlineList }) => {
  const { timers, start, pause, finish } = useResumableTimers()
  return (
    <StyledSideBar>
      <StyledOutlineHeader>
        <StyledOutlineHederTitle>Outline</StyledOutlineHederTitle>
      </StyledOutlineHeader>
      <StyledOutlineList>
        {outlineList.map((item) => {
          const timer = timers.find((v) => v.key === item.blockId)
          return (
            <OutlineListItem
              key={item.blockId}
              item={item}
              timer={timer}
              onStart={start}
              onPause={pause}
              onFinish={finish}
            />
          )
        })}
      </StyledOutlineList>
    </StyledSideBar>
  )
}

const StyledSideBar = styled('div', {
  paddingLeft: 16,
  minWidth: 260,
  width: 260,
  position: 'absolute',
  top: 0,
  right: 0,
})

const StyledOutlineHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: 4,
})
const StyledOutlineHederTitle = styled('div', {
  fontWeight: 500,
  fontSize: 14,
  whiteSpace: 'pre-wrap',
})

const StyledOutlineList = styled('ul', {
  listStyle: 'none',
  marginBlockStart: 0,
  marginBlockEnd: 0,
  paddingInlineStart: 0,
})
