import { useState, type CSSProperties, type FormEvent } from 'react'
import { LEAD_FORM } from '../content'
import { useInView } from '../lib/useInView'
import { Letters } from './Letters'
import styles from './Tour.module.css'

export function Tour() {
  const { ref, visible } = useInView<HTMLElement>(.5)
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section id="tour" ref={ref} className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <div className="frame">
        <div className={styles.leadStack}>
          <div className={styles.leadHeader}>
            <h2 className={styles.title} aria-label={LEAD_FORM.titleAria}>
              <Letters text={LEAD_FORM.titlePart1} className="trim-display" step={.05} includeSpaces />
              <Letters text={LEAD_FORM.titlePart2} className={`trim-display ${styles.orange}`} start={.55} step={.05} includeSpaces />
            </h2>
            <span className={`trim ${styles.kicker}`}>{LEAD_FORM.kicker}</span>
          </div>

          <form className={styles.table} onSubmit={onSubmit} noValidate>
            <div className={styles.item} style={{ '--i': 0 } as CSSProperties}>
              <div className={`${styles.row} ${styles.rowSplit3}`}>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.colName}</span>
                  <input required className={styles.input} name="name" autoComplete="name" placeholder={LEAD_FORM.namePlaceholder} disabled={sent} />
                </label>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.colPhone}</span>
                  <input
                    required
                    className={styles.input}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={LEAD_FORM.phonePlaceholder}
                    disabled={sent}
                  />
                </label>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.colEmail}</span>
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={LEAD_FORM.emailPlaceholder}
                    disabled={sent}
                  />
                </label>
              </div>
            </div>

            <div className={styles.item} style={{ '--i': 1 } as CSSProperties}>
              <div className={`${styles.row} ${styles.rowSplit2}`}>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.eventTypeLabel}</span>
                  <select required className={styles.select} name="eventType" defaultValue="" disabled={sent}>
                    <option value="" disabled>{LEAD_FORM.eventTypeDefault}</option>
                    {LEAD_FORM.eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.datePlaceholder}</span>
                  <input className={styles.input} name="eventDate" type="date" disabled={sent} />
                </label>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.locationPlaceholder}</span>
                  <input className={styles.input} name="location" placeholder={LEAD_FORM.locationPlaceholder} disabled={sent} />
                </label>
                <label className={styles.field}>
                  <span className={`trim ${styles.label}`}>{LEAD_FORM.guestsPlaceholder}</span>
                  <input className={styles.input} name="guests" inputMode="numeric" placeholder={LEAD_FORM.guestsPlaceholder} disabled={sent} />
                </label>
              </div>
            </div>

            <div className={styles.item} style={{ '--i': 2 } as CSSProperties}>
              <label className={styles.field}>
                <span className={`trim ${styles.label}`}>{LEAD_FORM.colEvent}</span>
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={4}
                  placeholder={LEAD_FORM.messagePlaceholder}
                  disabled={sent}
                />
              </label>
            </div>

            <div className={styles.item} style={{ '--i': 3 } as CSSProperties}>
              <div className={styles.rowSubmit}>
                {sent
                  ? <p className={`trim ${styles.success}`} role="status">{LEAD_FORM.success}</p>
                  : (
                    <button type="submit" className={styles.ticket}>
                      <span className="trim">{LEAD_FORM.submit}</span>
                    </button>
                  )}
              </div>
            </div>
          </form>

          <footer className={styles.footer}>
            <span className="trim">{LEAD_FORM.footerNote}</span>
            <span className="trim">{LEAD_FORM.footerCredit}</span>
          </footer>
        </div>
      </div>
    </section>
  )
}
