import { useCallback, useEffect, useRef, useState } from 'react'
import { MAIN_THEME, TRACKS } from '../content'

export type PlayerId = 'album' | number
export type PlayerState = {
  active: PlayerId | null
  progress: number
  remaining: number
  startedAt: number
  toggle: (id: PlayerId) => void
}

export function usePlayer(): PlayerState {
  const [active, setActive] = useState<PlayerId | null>(null)
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [startedAt, setStartedAt] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const frameRef = useRef(0)
  const startRef = useRef(0)

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    audioRef.current?.pause()
    audioRef.current = null
    setActive(null)
    setProgress(0)
    setRemaining(0)
  }, [])

  const toggle = useCallback((id: PlayerId) => {
    if (active === id) {
      stop()
      return
    }
    cancelAnimationFrame(frameRef.current)
    audioRef.current?.pause()
    audioRef.current = null
    const length = id === 'album' ? Infinity : TRACKS[id]?.excerpt ?? 0
    const source = id === 'album' ? MAIN_THEME : TRACKS[id]?.preview
    const started = performance.now()
    startRef.current = started
    setStartedAt(started)
    setActive(id)
    setProgress(0)
    setRemaining(Number.isFinite(length) ? length : 0)
    if (source) {
      const audio = new Audio(source)
      audioRef.current = audio
      audio.addEventListener('ended', stop, { once: true })
      void audio.play().catch(() => undefined)
    }
  }, [active, stop])

  useEffect(() => {
    if (active === null) return
    const length = active === 'album' ? Infinity : TRACKS[active]?.excerpt ?? 0
    const tick = (now: number) => {
      const audio = audioRef.current
      const elapsed = audio && Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : (now - startRef.current) / 1000
      if (Number.isFinite(length) && elapsed >= length) {
        stop()
        return
      }
      setProgress(Number.isFinite(length) ? Math.min(1, elapsed / length) : 0)
      setRemaining(Number.isFinite(length) ? Math.max(0, length - elapsed) : 0)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, stop])

  useEffect(() => stop, [stop])
  return { active, progress, remaining, startedAt, toggle }
}
