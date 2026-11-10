import { MENU_LINKS } from '../content'
import styles from './Menu.module.css'

type Props = { open: boolean; onClose: () => void }

export function Menu({ open, onClose }: Props) {
  return (
    <div
      id="menu"
      className={`${styles.menu} ${open ? styles.open : ''}`}
      dir="rtl"
      lang="he"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      {MENU_LINKS.map(([label, href]) => (
        <a key={href} href={href} onClick={onClose} dir="rtl">
          {[...label].map((letter, i) =>
            letter === ' ' ? (
              <span key={`sp-${i}`} className={styles.wordGap} aria-hidden="true" />
            ) : (
              <span className={styles.clip} key={`${letter}-${i}`}>
                <span className={styles.track} style={{ transitionDelay: `${i * 34}ms` }}>
                  <span>{letter}</span><span>{letter}</span>
                </span>
              </span>
            ),
          )}
        </a>
      ))}
    </div>
  )
}
