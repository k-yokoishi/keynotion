import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { globalCss, styled } from '@stitches/react'

type Props = { enabled: boolean }

type PointerPosition = {
  x: number
  y: number
} | null

const hideCursorClass = 'kn-hide-cursor'

export const MousePointer: React.FC<Props> = ({ enabled }) => {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>(null)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPointerPosition({ x: e.clientX, y: e.clientY })
    }
    const body = document.body
    body.addEventListener('mousemove', onMouseMove)
    if (enabled && !body.classList.contains(hideCursorClass)) {
      body.classList.add(hideCursorClass)
    }
    return () => {
      if (body.classList.contains(hideCursorClass)) {
        body.classList.remove(hideCursorClass)
      }
    }
  })

  const globalCursorNone = globalCss({
    '.kn-hide-cursor': {
      '*': {
        cursor: 'none !important',
      },
    },
  })
  globalCursorNone()

  useEffect(() => {
    const hidden = document.body.classList.contains(hideCursorClass)
    if (enabled) {
      if (!hidden) {
        document.body.classList.add(hideCursorClass)
      }
    } else if (hidden) {
      document.body.classList.remove(hideCursorClass)
    }
  }, [enabled])

  return (
    <>
      {enabled &&
        pointerPosition &&
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
