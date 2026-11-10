import { useEffect, useRef } from 'react'

const PATTERN = [16,34,54,16,28,20,46,28,16,12,26,38,12,22,16,34,22,14,12,28,46,14,26,16,38,26,14,8,18,28,8,16,10,26,16,8,14,28,46,14]
type Props = { playing: boolean; startedAt: number; className?: string }

export function Wave({ playing, startedAt, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current, probe = probeRef.current
    if (!canvas || !probe) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 2), unit = probe.getBoundingClientRect().width / 100
      const width = Math.round(rect.width * dpr), height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
      context.setTransform(dpr,0,0,dpr,0,0); context.clearRect(0,0,rect.width,rect.height); context.fillStyle = '#fff'
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const t = reduced ? 0 : (now - startedAt) / 1000
      const step = 8 * unit
      for (let k = Math.floor(-rect.width / step); k <= Math.ceil(rect.width / step); k++) {
        const base = PATTERN[((k % PATTERN.length) + PATTERN.length) % PATTERN.length]!
        const pulse = .5 + .5 * Math.sin(t * 6.1 + k * .47), swell = .5 + .5 * Math.sin(t * 2.3 - k * .11)
        const barHeight = Math.max(4, base * (.25 + .75 * (.6 * pulse + .4 * swell))) * unit
        context.fillRect(rect.width / 2 + 4 * unit + k * step - unit, (rect.height - barHeight) / 2, 2 * unit, barHeight)
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [playing, startedAt])
  return <><canvas ref={canvasRef} className={className} /><div ref={probeRef} style={{ position: 'absolute', width: 'calc(100 * var(--u))', visibility: 'hidden' }} /></>
}
