import { useRef } from 'react'
import { ASSETS, RELEASE } from '../content'
import type { PlayerState } from '../lib/usePlayer'
import { useInView } from '../lib/useInView'
import { Letters } from './Letters'
import { Wave } from './Wave'
import styles from './Release.module.css'

export function Release({ player }: { player: PlayerState }) {
  const { ref, visible } = useInView<HTMLElement>(.22)
  const albumRef = useRef<HTMLButtonElement>(null)
  const playing = player.active === 'album'
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5, y = (event.clientY - rect.top) / rect.height - .5
    event.currentTarget.style.setProperty('--cx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--cy', `${event.clientY - rect.top}px`)
    albumRef.current?.style.setProperty('--rx', `${y * -24.2}deg`)
    albumRef.current?.style.setProperty('--ry', `${x * 30.8}deg`)
  }
  const leave = () => { albumRef.current?.style.setProperty('--rx', '0deg'); albumRef.current?.style.setProperty('--ry', '0deg') }
  return (
    <section id="release" ref={ref} className={`${styles.release} ${visible ? styles.visible : ''}`} onPointerMove={move} onPointerLeave={leave}>
      <Wave playing={playing} startedAt={player.startedAt} className={`${styles.wave} ${playing ? styles.waveOn : ''}`} />
      <div className="frame">
        <span className={`trim ${styles.kicker}`}>{RELEASE.kicker}</span>
        <span className={`trim ${styles.date}`}>{RELEASE.dateLine}</span>
        <h2 className={styles.title} aria-label={RELEASE.titleAria}>
          <Letters text={RELEASE.titleLine1} className="trim-display" step={.05} />
          <Letters text={RELEASE.titleLine2} className="trim-display" start={.4} step={.05} />
          <span className={`trim-display ${styles.lp}`}>{RELEASE.lpTag}</span>
        </h2>
        <button
          ref={albumRef}
          className={styles.album}
          data-cursor="hide"
          onClick={() => player.toggle('album')}
          aria-label={playing ? RELEASE.pauseTheme : RELEASE.playTheme}
        >
          <img src={ASSETS.album} alt={RELEASE.albumCoverAlt} />
          {playing ? <span className={styles.pause}><i /><i /></span> : <img className={styles.play} src={ASSETS.playLarge} alt="" />}
        </button>
        <div className={styles.caption}>
          <span className="trim">{RELEASE.caption1}</span>
          <span className="trim">{RELEASE.caption2}</span>
        </div>
      </div>
      <div className={styles.cursor}><span className="trim">{RELEASE.cursor1}</span><span className="trim">{RELEASE.cursor2}</span></div>
    </section>
  )
}
