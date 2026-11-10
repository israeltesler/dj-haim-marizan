import { useEffect, useRef } from 'react'
import { ASSETS, EQUIPMENT, EQUIPMENT_LABEL, STATEMENT_KICKER, STATEMENT_LINES, STATEMENT_NOTE } from '../content'
import { useInView } from '../lib/useInView'
import styles from './Statement.module.css'

const STATEMENT_FALLBACK = 'https://assets.uberdesigner.ai/dj-zak/statement.webp'

export function Statement() {
  const { ref, visible } = useInView<HTMLElement>(.2)
  const textRef = useRef<HTMLDivElement>(null)

  const centerSpot = (block: HTMLDivElement) => {
    block.style.setProperty('--fx', `${block.clientWidth * 0.5}px`)
    block.style.setProperty('--fy', `${block.clientHeight * 0.4}px`)
  }

  useEffect(() => {
    const block = textRef.current
    if (!block) return
    centerSpot(block)
    const ro = new ResizeObserver(() => centerSpot(block))
    ro.observe(block)
    return () => ro.disconnect()
  }, [visible])

  useEffect(() => {
    const block = textRef.current
    if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const desktop = () => matchMedia('(min-width: 1024px)').matches

    let current = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }
    let frame = 0
    let last = 0
    let first = true
    let tracking = false
    let pointerDown = false
    let scrollGesture = false
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let holdTimer: ReturnType<typeof setTimeout> | undefined

    const HOLD_MS = 150
    const MOVE_PX = 10

    const clearHold = () => {
      if (holdTimer !== undefined) clearTimeout(holdTimer)
      holdTimer = undefined
    }

    const markScroll = () => {
      scrollGesture = true
      clearHold()
    }

    const tick = (now: number) => {
      const amount = 1 - Math.exp(-Math.min(32, now - last) / 140)
      last = now
      current.x += (target.x - current.x) * amount
      current.y += (target.y - current.y) * amount
      block.style.setProperty('--fx', `${current.x}px`)
      block.style.setProperty('--fy', `${current.y}px`)
      frame = Math.hypot(target.x - current.x, target.y - current.y) > 0.1 ? requestAnimationFrame(tick) : 0
    }

    const setTarget = (clientX: number, clientY: number) => {
      const rect = block.getBoundingClientRect()
      target = { x: clientX - rect.left, y: clientY - rect.top }
      if (first) {
        first = false
        current = { ...target }
        block.style.setProperty('--fx', `${current.x}px`)
        block.style.setProperty('--fy', `${current.y}px`)
      } else if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const photoOn = () => {
      tracking = true
      block.dataset.photo = ''
    }

    const photoOff = () => {
      tracking = false
      first = true
      delete block.dataset.photo
      cancelAnimationFrame(frame)
      frame = 0
      centerSpot(block)
    }

    const onPointerMove = (event: PointerEvent) => {
      lastX = event.clientX
      lastY = event.clientY

      if (pointerDown && !tracking && !scrollGesture) {
        const dx = event.clientX - startX
        const dy = event.clientY - startY
        const dist = Math.hypot(dx, dy)
        if (dist > MOVE_PX && Math.abs(dy) > Math.abs(dx)) markScroll()
      }

      if (!tracking) return
      setTarget(event.clientX, event.clientY)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (desktop()) return
      if (event.pointerType === 'mouse') return
      pointerDown = true
      scrollGesture = false
      startX = lastX = event.clientX
      startY = lastY = event.clientY
      clearHold()
      holdTimer = setTimeout(() => {
        holdTimer = undefined
        if (!pointerDown || scrollGesture || tracking) return
        photoOn()
        setTarget(lastX, lastY)
      }, HOLD_MS)
    }

    const endTouch = (event: PointerEvent) => {
      if (desktop()) return
      if (event.pointerType === 'mouse') return
      pointerDown = false
      clearHold()
      if (scrollGesture && !tracking) return
      if (tracking) photoOff()
    }

    const onMouseEnter = () => {
      if (!desktop()) return
      photoOn()
    }

    const onMouseLeave = () => {
      if (!desktop()) return
      photoOff()
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!desktop() || !tracking) return
      setTarget(event.clientX, event.clientY)
    }

    block.addEventListener('pointerdown', onPointerDown, { passive: true })
    block.addEventListener('pointermove', onPointerMove, { passive: true })
    block.addEventListener('pointerup', endTouch, { passive: true })
    block.addEventListener('pointercancel', endTouch, { passive: true })
    block.addEventListener('mouseenter', onMouseEnter)
    block.addEventListener('mouseleave', onMouseLeave)
    block.addEventListener('mousemove', onMouseMove)

    return () => {
      clearHold()
      photoOff()
      block.removeEventListener('pointerdown', onPointerDown)
      block.removeEventListener('pointermove', onPointerMove)
      block.removeEventListener('pointerup', endTouch)
      block.removeEventListener('pointercancel', endTouch)
      block.removeEventListener('mouseenter', onMouseEnter)
      block.removeEventListener('mouseleave', onMouseLeave)
      block.removeEventListener('mousemove', onMouseMove)
    }
  }, [visible])

  return (
    <section id="statement" ref={ref} dir="rtl" lang="he" className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <div className="frame">
        <span className={`trim ${styles.kicker}`}>{STATEMENT_KICKER}</span>
        <div className={styles.textBlock}>
          <div ref={textRef} className={styles.textStack}>
            <p aria-label={STATEMENT_LINES.join(' ')}>
              {STATEMENT_LINES.map((line, i) => (
                <span className={styles.clip} key={line} style={{ '--i': i } as React.CSSProperties}>
                  <span className={styles.statementLine}>{line}</span>
                </span>
              ))}
            </p>
            <img
              src={ASSETS.statement}
              alt=""
              decoding="async"
              onError={e => { e.currentTarget.src = STATEMENT_FALLBACK }}
            />
          </div>
        </div>
        <p className={`trim ${styles.note}`}>{STATEMENT_NOTE.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
        <div className={styles.equipment}>
          <span className="trim">{EQUIPMENT_LABEL}</span>
          <div>{EQUIPMENT.map(item => <span className={styles.equipmentPill} key={item}><span className="trim">{item}</span></span>)}</div>
        </div>
      </div>
    </section>
  )
}
