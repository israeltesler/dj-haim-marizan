import { useCallback, useEffect, useRef, useState } from 'react'
import { ARTIST, HERO_NOTES, NAV } from '../content'
import { Letters } from './Letters'
import { Menu } from './Menu'
import { Nav } from './Nav'
import { HeroRipple } from './HeroRipple'
import styles from './Hero.module.css'

type Props = {
  src: string | null
  ready: boolean
  onPhotoDone: () => void
}

export function Hero({ src, ready, onPhotoDone }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [menu, setMenu] = useState(false)
  const [fallback, setFallback] = useState(false)
  const enableFallback = useCallback(() => setFallback(true), [])

  useEffect(() => {
    if (!menu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('#menu') || target.closest('[data-menu-toggle]')) return
      setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [menu])

  useEffect(() => {
    const hero = sectionRef.current
    if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = hero.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height))
      hero.style.setProperty('--scale', String(1 + .2 * progress))
      hero.style.setProperty('--shift', `${-7 * progress}%`)
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', request)
      removeEventListener('resize', request)
    }
  }, [])

  const imageLoaded = async () => {
    const image = imageRef.current
    if (!image) return
    await Promise.race([image.decode().catch(() => undefined), new Promise(r => setTimeout(r, 1500))])
    setLoaded(true)
    setImageElement(image)
    onPhotoDone()
  }

  const pointer = (event: React.PointerEvent<HTMLElement>) => {
    const hero = event.currentTarget
    const rect = hero.getBoundingClientRect()
    hero.style.setProperty('--x', `${event.clientX - rect.left}px`)
    hero.style.setProperty('--y', `${event.clientY - rect.top}px`)
    if (event.pointerType !== 'mouse') hero.setAttribute('data-touching', '')
  }
  const pointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.removeAttribute('data-touching')
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className={styles.hero}
      data-ready={ready || undefined}
      data-menu-open={menu || undefined}
      onPointerMove={pointer}
      onPointerDown={pointer}
      onPointerUp={pointerEnd}
      onPointerCancel={pointerEnd}
    >
      <div className={styles.media}>
        {src && <img ref={imageRef} src={src} alt="" className={loaded ? styles.loaded : ''} onLoad={imageLoaded} onError={onPhotoDone} />}
        {loaded && <HeroRipple image={imageElement} onFallback={enableFallback} />}
      </div>
      <div className={styles.shade} />
      {fallback && <div className={styles.fallback} />}
      <Menu open={menu} onClose={() => setMenu(false)} />
      <div className="frame">
        <Nav open={menu} onToggle={() => setMenu(value => !value)} />
        <h1 className={styles.name} aria-label={`${ARTIST.first} ${ARTIST.name} ${ARTIST.surname}`}>
          <Letters text={ARTIST.first} className="trim-display" start={.38} />
          <span className={styles.nameGroup}>
            <Letters text={ARTIST.name} className="trim-display" start={.58} />
            <Letters text={ARTIST.surname} className={`${styles.surname} trim-display`} start={.88} />
          </span>
        </h1>
        <span className={`${styles.registered} trim-display`} aria-hidden="true">®</span>
        <div className={styles.subrow}>
          <span className="trim">{ARTIST.descriptor}</span><span className="trim">{ARTIST.spec}</span>
        </div>
        <p className={`${styles.notes} trim`}>{HERO_NOTES.map((line, i) => <span key={i}>{line || '\u00a0'}<br /></span>)}</p>
        <a className={`pill ${styles.cta}`} href="#tour">
          <span className={styles.ctaInner}>
            <span className={styles.ctaIconBadge} aria-hidden="true">
              <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 14v-2a8 8 0 0 1 16 0v2"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M4 14v3a2 2 0 0 0 2 2h2v-7H4Zm16 0v3a2 2 0 0 1-2 2h-2v-7h4Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={`trim ${styles.ctaLabel}`}>{NAV.seeSchedule}</span>
          </span>
        </a>
      </div>
    </section>
  )
}
