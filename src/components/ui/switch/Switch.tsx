import { FC } from 'react'
import * as RadixSwitch from '@radix-ui/react-switch'
import { styled } from '../../../styles/theme'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
}
export const Switch: FC<Props> = ({ checked, onChange }) => {
  return (
    <StyledSwitchRoot checked={checked} onCheckedChange={() => onChange(!checked)}>
      <StyledSwitchThumb />
    </StyledSwitchRoot>
  )
}

const StyledSwitchThumb = styled(RadixSwitch.Thumb, {
  display: 'block',
  width: 14,
  height: 14,
  background: 'White',
  borderRadius: 44,
  transition: 'transform 200ms ease-out 0s, background 200ms ease-out 0s',
  transform: 'translateX(0px) translateY(0px)',
})

const StyledSwitchRoot = styled(RadixSwitch.Root, {
  all: 'unset',
  background: 'rgba(135, 131, 120, 0.3)',
  height: 14,
  width: 26,
  padding: 2,
  boxSizing: 'content-box',
  borderRadius: 44,
  transition: 'background 200ms ease 0s, box-shadow 200ms ease 0s',
  ["&:not([data-state='checked'])"]: {
    '&:hover': {
      background: 'rgba(55,53,47,0.16)',
    },
  },
  ["&[data-state='checked']"]: {
    backgroundColor: 'rgb(35, 131, 226)',
    [`& ${StyledSwitchThumb}`]: {
      transform: 'translateX(12px) translateY(0px)',
    },
  },
})
