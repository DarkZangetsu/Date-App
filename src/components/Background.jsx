// Positions fixes : le décor reste identique d'une visite à l'autre.
const HEARTS = [
  { left: 6, size: 18, delay: 0, dur: 26 },
  { left: 18, size: 11, delay: 9, dur: 31 },
  { left: 31, size: 24, delay: 4, dur: 34 },
  { left: 47, size: 13, delay: 15, dur: 28 },
  { left: 63, size: 20, delay: 2, dur: 33 },
  { left: 76, size: 12, delay: 12, dur: 27 },
  { left: 88, size: 22, delay: 6, dur: 36 },
  { left: 95, size: 10, delay: 19, dur: 30 },
]

export default function Background() {
  return (
    <div className="backdrop" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <svg
          key={i}
          className="drift"
          viewBox="0 0 24 24"
          style={{
            left: `${h.left}%`,
            width: h.size,
            animationDelay: `-${h.delay}s`,
            animationDuration: `${h.dur}s`,
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  )
}
