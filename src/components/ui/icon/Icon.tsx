import { library } from '@fortawesome/fontawesome-svg-core'
import { faPauseCircle, faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { styled } from '@stitches/react'
import React from 'react'

export const initialize = () => {
  library.add(faPlayCircle, faPauseCircle, faStopCircle)
}

export const Icon: React.FC<FontAwesomeIconProps> = (prop) => {
  return <StyledIcon {...prop} clickable={prop.onClick !== undefined} />
}

const StyledIcon = styled(FontAwesomeIcon, {
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
      },
    },
  },
})
