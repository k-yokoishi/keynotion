import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import throttle from 'lodash/throttle'
import { styled } from '../../styles/theme'
import { globalCss } from '@stitches/react'

type Props = { enabled: boolean }

type PointerPosition = {
  x: number
  y: number
} | null

const hideCursorClass = 'kn-hide-cursor'

export const LaserPointer: React.FC<Props> = ({ enabled }) => {
  const [pointerPosition, setPointerPosition] = useState<PointerPosition>(null)
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; fading: boolean }[]>(
    []
  )
  const [keynotionRoot, setKeynotionRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const onMouseMove = throttle((e: MouseEvent) => {
      setPointerPosition({ x: e.clientX, y: e.clientY })
    }, 1000 / 60 /* 60fps */)
    const body = document.body
    window.addEventListener('mousemove', onMouseMove)
    if (enabled && !body.classList.contains(hideCursorClass)) {
      body.classList.add(hideCursorClass)
    }
    const onClick = ({ clientX, clientY }: MouseEvent) => {
      const id = new Date().getTime().toString()
      setRipples((prev) => [...prev, { id, x: clientX, y: clientY, fading: false }])
      requestAnimationFrame(() => {
        setRipples((prev) =>
          prev.map((ripple) => (ripple.id === id ? { ...ripple, fading: true } : ripple))
        )
        setTimeout(() => {
          setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
        }, 600)
      })
    }
    window.addEventListener('click', onClick)
    return () => {
      if (body.classList.contains(hideCursorClass)) {
        body.classList.remove(hideCursorClass)
      }
      window.removeEventListener('click', onClick)
      window.removeEventListener('mousemove', onMouseMove)
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

  useEffect(() => {
    const keynotionRoot = document.getElementById('kn-root')
    if (keynotionRoot) {
      setKeynotionRoot(keynotionRoot)
    }
  }, [])

  return (
    <>
      {enabled &&
        keynotionRoot !== null &&
        pointerPosition &&
        createPortal(
          <>
            <StyledMousePointer
              style={{
                transform: `translate(${pointerPosition.x}px, ${pointerPosition.y}px)`,
              }}
            />
            {ripples.map((ripple) => (
              <StyledRipple
                className={ripple.fading ? 'fading' : ''}
                key={`${ripple.x}-${ripple.y}`}
                style={{
                  top: ripple.y,
                  left: ripple.x,
                }}
              />
            ))}
          </>,
          keynotionRoot
        )}
    </>
  )
}

const LaserPointerColor = 'rgba(212, 76, 71, 1)'

const StyledMousePointer = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 999999,
  width: 8,
  height: 8,
  boxShadow: `0 0 8px ${LaserPointerColor}`,
  borderRadius: 5,
  backgroundColor: LaserPointerColor,
  pointerEvents: 'none',
})

const StyledRipple = styled('div', {
  position: 'fixed',
  zIndex: 999999,
  width: 10,
  height: 10,
  transform: 'translate(-50%, -50%) scale(0)',
  boxShadow: `0 0 8px ${LaserPointerColor}`,
  backgroundColor: LaserPointerColor,
  borderRadius: 999,
  pointerEvents: 'none',
  transitionDuration: '600ms',
  opacity: 1,
  '&.fading': {
    transform: 'translate(-50%, -50%) scale(6)',
    opacity: 0,
  },
})
