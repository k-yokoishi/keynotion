import { styled } from '@stitches/react'
import { HeaderLevel } from '../../atoms/outline'
import { useResumableTimers } from '../../atoms/resumableTimer'
import { OutlineListItem } from './OutlineListItem'

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
  currentlyViewed: boolean
}

type Props = {
  outlineList: OutlineItem[]
}

export const OutlineList: React.FC<Props> = ({ outlineList }) => {
  const { timers, start, finish } = useResumableTimers()
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
