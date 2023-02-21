import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { globalCss, styled } from '@stitches/react'

type PointerPosition = {
  x: number
  y: number
} | null

export const MousePointer: React.FC = () => {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>(null)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPointerPosition({ x: e.clientX, y: e.clientY })
    }
    document.body.addEventListener('mousemove', onMouseMove)
    return () => document.body.removeEventListener('mousemove', onMouseMove)
  })

  const globalCursorNone = globalCss({
    html: {
      '*': {
        cursor: 'none !important',
      },
    },
  })
  globalCursorNone()

  return (
    <>
      {pointerPosition &&
        createPortal(
          <StyledMousePointer
            css={{
              top: pointerPosition.y,
              left: pointerPosition.x,
            }}
          />,
          document.body
        )}
    </>
  )
}

const StyledMousePointer = styled('div', {
  position: 'absolute',
  zIndex: 100,
  width: 10,
  height: 10,
  boxShadow: '0 0 8px red',
  borderRadius: 5,
  backgroundColor: 'red',
  pointerEvents: 'none',
})
