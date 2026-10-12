import { useCallback, useRef, useState } from 'react'
import RunawayButton from './RunawayButton.jsx'
import Seal from './Seal.jsx'
import { config } from '../config.js'
import { useFocusOnMount } from '../hooks/useFocusOnMount.js'

const TEASES = [
  'Eh, pourquoi tu veux cliquer ici ? 👀',
  'Oups, raté ! 😂',
  'Tu es vraiment sûre ? 🥹',
  'Essaie encore… enfin, si tu peux 😏',
  'Le bouton d’à côté a l’air bien plus sympa, non ?',
  'Il est rapide, hein.',
]
const MAX_ESCAPES = TEASES.length + 1

export default function AskStep({ onYes, onNo }) {
  const titleRef = useFocusOnMount()
  const yesRef = useRef(null)
  const [escapes, setEscapes] = useState(0)
  const tired = escapes >= MAX_ESCAPES
  const onEscape = useCallback(() => setEscapes((n) => n + 1), [])

  let tease = ''
  if (tired) tease = 'Bon… il est épuisé. Tu peux l’attraper, si tu y tiens vraiment 🥺'
  else if (escapes > 0) tease = TEASES[(escapes - 1) % TEASES.length]

  const intro = config.name
    ? `${config.name}, j’ai une question très importante à te poser…`
    : 'J’ai une question très importante à te poser…'

  return (
    <section className="step ask">
      <Seal />
      <p className="eyebrow">{intro} 👀</p>
      <h1 className="title" ref={titleRef} tabIndex={-1}>
        Est-ce que tu m’accorderais un{' '}
        <em className="squiggle">
          date
          <svg viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 9c14-6 24-6 34-1s22 5 33 0 26-6 49 1" />
          </svg>
        </em>
        &nbsp;?
      </h1>
      <p className="lede">
        Toi, moi, un moment rien qu’à nous. Réfléchis bien… mais pas trop longtemps.
      </p>

      <div className="choices">
        <button
          ref={yesRef}
          type="button"
          className="btn btn-yes"
          style={{ '--grow': 1 + Math.min(escapes, MAX_ESCAPES) * 0.035 }}
          onClick={onYes}
        >
          Oui ❤️
        </button>
        <RunawayButton avoidRef={yesRef} tired={tired} onEscape={onEscape} onChoose={onNo}>
          Non 🙈
        </RunawayButton>
      </div>

      <p className="tease" aria-live="polite">
        {tease}
      </p>
    </section>
  )
}
