import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value = 0, duration = 700, className }) {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    const startValue = 0
    const endValue = target

    if (endValue === startValue) {
      setDisplay(endValue)
      return undefined
    }

    startRef.current = performance.now()
    setDisplay(startValue)

    function tick(now) {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (endValue - startValue) * eased)
      setDisplay(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
        setDisplay(endValue)
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [target, duration])

  return <span className={className}>{display}</span>
}
