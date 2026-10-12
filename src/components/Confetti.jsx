import { useEffect, useMemo, useState } from 'react'
import { prefersReducedMotion } from '../utils/motion.js'

const COLORS = ['#b3164d', '#e05a84', '#f2b8c6', '#9d86c9', '#f6d7a7']
const COUNT = 54

/** Pluie légère de confettis et de petits cœurs, qui se retire toute seule. */
export default function Confetti() {
  const [visible, setVisible] = useState(() => !prefersReducedMotion())

  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        heart: i % 4 === 0,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() - 0.5) * 900,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.5,
        dur: 2.4 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
      })),
    [],
  )

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 4800)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible) return null

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.heart ? 'piece piece-heart' : 'piece'}
          style={{
            left: `${p.left}%`,
            '--size': `${p.size}px`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            '--color': p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}
