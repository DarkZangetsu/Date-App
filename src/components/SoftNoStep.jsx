import { useFocusOnMount } from '../hooks/useFocusOnMount.js'

/** La vraie sortie : dire non reste possible, et c'est accueilli avec le sourire. */
export default function SoftNoStep({ onYes }) {
  const titleRef = useFocusOnMount()
  return (
    <section className="step soft-no">
      <p className="eyebrow">Message bien reçu</p>
      <h1 className="title" ref={titleRef} tabIndex={-1}>
        D’accord, <em>pas de souci.</em>
      </h1>
      <p className="lede">
        C’était un jeu, pas un piège : ta réponse compte vraiment. Et si un jour tu changes
        d’avis, le bouton « Oui », lui, ne s’enfuit jamais.
      </p>
      <div className="choices">
        <button type="button" className="btn btn-yes" onClick={onYes}>
          En fait… oui ❤️
        </button>
      </div>
    </section>
  )
}
