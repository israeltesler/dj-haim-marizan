import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(threshold: number) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio >= threshold) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, visible])

  return { ref, visible }
}
