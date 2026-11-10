import type { CSSProperties } from 'react'

type Props = {
  text: string
  className?: string
  start?: number
  step?: number
  includeSpaces?: boolean
}

const HEBREW = /[\u0590-\u05FF\uFB1D-\uFB4F]/

export function Letters({ text, className, start = 0, step = 0.1, includeSpaces = false }: Props) {
  const rtl = HEBREW.test(text)
  return (
    <span className={className} dir={rtl ? 'rtl' : undefined} aria-hidden="true">
      {[...text].map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={{ '--delay': `${start + index * step}s` } as CSSProperties}
        >
          {letter === ' ' && includeSpaces ? '\u00a0' : letter}
        </span>
      ))}
    </span>
  )
}
