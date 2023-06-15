import { throttle } from 'lodash'
import { useEffect, useState } from 'react'
export const useMouseMove = (el: HTMLElement) => {
  const [clientX, setClientX] = useState(0)
  const [clientY, setClientY] = useState(0)
  const [innerWidth, setInnerWidth] = useState(0)
  const handleMouseMove = throttle((e: MouseEvent) => {
    setClientX(e.clientX)
    setClientY(e.clientY)
    setInnerWidth(window.innerWidth)
  }, 1000 / 60 /* 60fps */)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [el, handleMouseMove])

  return {
    clientX,
    clientY,
    distanceFromRight: innerWidth - clientX,
  }
}
