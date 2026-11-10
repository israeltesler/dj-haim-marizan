import { useCallback, useEffect, useState } from 'react'
import { ASSETS } from './content'
import { Cursor } from './components/Cursor'
import { Hero } from './components/Hero'
import { Release } from './components/Release'
import { Statement } from './components/Statement'
import { Tour } from './components/Tour'
import { Tracklist } from './components/Tracklist'
import { usePlayer } from './lib/usePlayer'

export default function App() {
  const [heroSrc, setHeroSrc] = useState<string | null>(null)
  const [fontsDone, setFontsDone] = useState(false)
  const [photoDone, setPhotoDone] = useState(false)
  const [forcedReady, setForcedReady] = useState(false)
  const player = usePlayer()
  const reportPhoto = useCallback(() => setPhotoDone(true), [])

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''
    fetch(ASSETS.hero, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Hero request failed: ${response.status}`)
        return response.blob()
      })
      .then(blob => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setHeroSrc(objectUrl)
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
          setHeroSrc(ASSETS.hero)
        }
      })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  useEffect(() => {
    let active = true
    const fonts = [
      "semi-condensed 500 1em 'Mona Sans'",
      "semi-condensed 200 1em 'Mona Sans'",
      "semi-condensed 600 1em 'Mona Sans'",
      '400 1em Geist',
      '500 1em Geist',
    ]
    Promise.all(fonts.map(font => document.fonts.load(font))).finally(() => active && setFontsDone(true))
    const timer = window.setTimeout(() => setForcedReady(true), 4000)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [])

  const ready = forcedReady || (fontsDone && photoDone)
  return (
    <main>
      <Hero src={heroSrc} ready={ready} onPhotoDone={reportPhoto} />
      <Statement />
      <Release player={player} />
      <Tracklist player={player} />
      <Tour />
      <Cursor />
    </main>
  )
}
