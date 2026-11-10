import type { CSSProperties } from 'react'
import { ASSETS, TRACKLIST, TRACKS } from '../content'
import type { PlayerState } from '../lib/usePlayer'
import { useInView } from '../lib/useInView'
import styles from './Tracklist.module.css'

const format = (seconds: number) => `00:${Math.ceil(seconds).toString().padStart(2, '0')}`

export function Tracklist({ player }: { player: PlayerState }) {
  const { ref, visible } = useInView<HTMLElement>(.5)
  return (
    <section ref={ref} className={`${styles.section} ${visible ? styles.visible : ''}`} aria-label={TRACKLIST.sectionAria}>
      <div className={styles.sunset} />
      <div className={`frame ${styles.frame}`}>
        <span className={`trim ${styles.kicker}`}>{TRACKLIST.kicker}</span>
        <div className={styles.table} role="table">
          <div className={styles.header} role="row">
            <span>{TRACKLIST.colNumber}</span>
            <span>{TRACKLIST.colName}</span>
            <span>{TRACKLIST.colExample}</span>
            <span>{TRACKLIST.colDuration}</span>
          </div>
          {TRACKS.map((track, index) => {
            const playing = player.active === index
            return (
              <div className={styles.row} role="row" key={track.title} style={{ '--i': index, '--progress': playing ? `${player.progress * 100}%` : '0%' } as CSSProperties}>
                <span className={`trim ${styles.number}`}>{String(index + 1).padStart(2, '0')}</span>
                <button
                  onClick={() => player.toggle(index)}
                  aria-label={`${playing ? TRACKLIST.pauseExcerpt : TRACKLIST.playExcerpt} ${track.title}`}
                >
                  {playing ? <span className={styles.pause}><i /><i /></span> : <img src={ASSETS.play} alt="" />}
                </button>
                <span className={`trim ${styles.title}`}>{track.title}</span>
                <span className={`trim ${styles.excerpt} ${playing ? styles.active : ''}`}>{playing ? format(player.remaining) : format(track.excerpt)}</span>
                <span className={`trim ${styles.duration}`}>{track.duration}</span>
                <span className={styles.fill} />
              </div>
            )
          })}
        </div>
        <div className={styles.bottom}>
          <span className="trim">{TRACKLIST.bottomLine}</span>
          <a className="pill" href="#tour"><span className="trim">{TRACKLIST.viewSchedule}</span></a>
        </div>
      </div>
    </section>
  )
}
