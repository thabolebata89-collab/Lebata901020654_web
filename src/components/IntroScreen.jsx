import { useEffect, useState } from 'react'

export default function IntroScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let timer
    let progressTimer

    if (isExiting) {
      timer = window.setTimeout(onComplete, 500)
    } else {
      const startedAt = performance.now()
      progressTimer = window.setInterval(() => {
        setProgress(Math.min(100, Math.floor(((performance.now() - startedAt) / 9500) * 100)))
      }, 100)
      timer = window.setTimeout(() => {
        setProgress(100)
        setIsExiting(true)
      }, 9500)
    }

    return () => {
      window.clearTimeout(timer)
      window.clearInterval(progressTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [isExiting, onComplete])

  return (
    <div className={`intro-screen${isExiting ? ' is-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Khanya Library welcome">
      <div className="intro-content">
        <div className="intro-brand" aria-hidden="true">
          <span className="intro-logo">K</span>
          <span className="intro-brand-rule" />
        </div>
        <p className="intro-kicker">COMMUNITY LIBRARY</p>
        <h1>Khanya Library</h1>
        <p className="intro-caption">Knowledge that lights the way.</p>
        <div className="intro-loading">
          <span>Loading your library</span>
          <span>{progress}%</span>
        </div>
      </div>
      <div
        className="intro-progress"
        role="progressbar"
        aria-label="Loading your library"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <button className="intro-skip" type="button" autoFocus onClick={() => setIsExiting(true)}>Skip <span aria-hidden="true">→</span></button>
    </div>
  )
}
