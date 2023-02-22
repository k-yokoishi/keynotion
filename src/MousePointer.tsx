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
  zIndex: 999999,
  width: 8,
  height: 8,
  boxShadow: '0 0 8px rgba(212, 76, 71, 1)',
  borderRadius: 5,
  backgroundColor: 'rgba(212, 76, 71, 1)',
  pointerEvents: 'none',
})
