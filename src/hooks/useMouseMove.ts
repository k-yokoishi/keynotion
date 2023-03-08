import { useEffect, useState } from 'react'
export const useMouseMove = (el: HTMLElement) => {
  const [clientX, setClientX] = useState(0)
  const [clientY, setClientY] = useState(0)
  const [innerWidth, setInnerWidth] = useState(0)
  const handleMouseMove = (e: MouseEvent) => {
    setClientX(e.clientX)
    setClientY(e.clientY)
    setInnerWidth(window.innerWidth)
  }
  useEffect(() => {
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    clientX,
    clientY,
    distanceFromRight: innerWidth - clientX,
  }
}
