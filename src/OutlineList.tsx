import { useResumableTimers } from './atoms/resumableTimer'
import { OutlineListItem } from './OutlineListItem'
import { styled } from './styles/theme'
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
    <StyledOutline>
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
    </StyledOutline>
  )
}

const StyledOutline = styled('div', {})

const StyledOutlineList = styled('ul', {
  listStyle: 'none',
  marginBlockStart: 0,
  marginBlockEnd: 0,
  paddingInlineStart: 0,
})
