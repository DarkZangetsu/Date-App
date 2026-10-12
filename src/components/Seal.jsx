/** Petit sceau animé : un cœur qui bat entouré d'un texte qui tourne doucement. */
export default function Seal() {
  return (
    <div className="seal" aria-hidden="true">
      <svg className="seal-ring" viewBox="0 0 100 100">
        <defs>
          <path id="seal-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
        </defs>
        <text>
          <textPath href="#seal-circle" textLength="232">
            rien que pour toi · question sérieuse ·
          </textPath>
        </text>
      </svg>
      <svg className="seal-heart" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  )
}
