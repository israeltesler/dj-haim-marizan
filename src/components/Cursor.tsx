import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cursor = ref.current
    if (!cursor || !matchMedia('(hover:hover) and (pointer:fine)').matches) return
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`
      cursor.dataset.visible = 'true'
      cursor.dataset.hidden = event.target instanceof Element && Boolean(event.target.closest('[data-cursor="hide"]')) ? 'true' : 'false'
    }
    const hide = () => { delete cursor.dataset.visible }
    addEventListener('pointermove', move); addEventListener('blur', hide); document.documentElement.addEventListener('mouseleave', hide)
    return () => { removeEventListener('pointermove', move); removeEventListener('blur', hide); document.documentElement.removeEventListener('mouseleave', hide) }
  }, [])
  return <div ref={ref} className={styles.anchor}><span /></div>
}
