import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/motion.js'

const EDGE = 16 // marge minimale avec les bords de l'écran
const AVOID_PAD = 32 // distance de sécurité autour du bouton « Oui »
const NEAR = 40 // distance du curseur qui déclenche la fuite
const MIN_JUMP = 140 // un saut doit être franc, pas un petit pas de côté
const COOLDOWN = 160
const HOME_MS = 520

const viewport = () => ({
  w: document.documentElement.clientWidth,
  h: document.documentElement.clientHeight,
})

const overlaps = (a, b, pad) =>
  a.left < b.right + pad &&
  a.right > b.left - pad &&
  a.top < b.bottom + pad &&
  a.bottom > b.top - pad

const distToRect = (x, y, r) =>
  Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom))

/** Cherche un endroit visible, loin du doigt/curseur, qui ne touche jamais le bouton « Oui ». */
function pickSpot(size, avoid, from, pointer) {
  const { w, h } = viewport()
  const maxX = Math.max(EDGE, w - size.w - EDGE)
  const maxY = Math.max(EDGE, h - size.h - EDGE)
  let best = null
  let bestScore = -1

  for (let i = 0; i < 80; i++) {
    const x = EDGE + Math.random() * (maxX - EDGE)
    const y = EDGE + Math.random() * (maxY - EDGE)
    const rect = { left: x, top: y, right: x + size.w, bottom: y + size.h }
    if (avoid && overlaps(rect, avoid, AVOID_PAD)) continue

    const jump = Math.hypot(x + size.w / 2 - from.x, y + size.h / 2 - from.y)
    const away = pointer ? distToRect(pointer.x, pointer.y, rect) : jump
    if (jump >= MIN_JUMP && away >= MIN_JUMP) return { x, y }

    const score = Math.min(jump, away)
    if (score > bestScore) {
      bestScore = score
      best = { x, y }
    }
  }
  return best ?? { x: EDGE, y: EDGE }
}

/**
 * Le bouton « Non » : il fuit le curseur et le doigt, puis finit par se laisser
 * attraper quand `tired` passe à true. Au clavier, il reste toujours utilisable.
 */
export default function RunawayButton({ avoidRef, tired, onEscape, onChoose, children }) {
  const slotRef = useRef(null)
  const btnRef = useRef(null)
  const [pos, setPos] = useState(null) // null = à sa place dans la page
  const [slot, setSlot] = useState(null) // taille réservée pour éviter tout saut de mise en page
  const posRef = useRef(null)
  const lastFlee = useRef(0)
  posRef.current = pos

  const spotAwayFrom = useCallback(
    (pointer) => {
      const r = btnRef.current.getBoundingClientRect()
      const avoid = avoidRef.current?.getBoundingClientRect()
      return pickSpot(
        { w: r.width, h: r.height },
        avoid,
        { x: r.left + r.width / 2, y: r.top + r.height / 2 },
        pointer,
      )
    },
    [avoidRef],
  )

  const flee = useCallback(
    (pointer) => {
      if (tired) return
      const now = performance.now()
      if (now - lastFlee.current < COOLDOWN) return
      lastFlee.current = now

      const next = spotAwayFrom(pointer)
      if (!posRef.current) {
        // Détachement : on fige le bouton là où il est, puis il s'envole à l'image suivante.
        const r = btnRef.current.getBoundingClientRect()
        setSlot({ w: r.width, h: r.height })
        setPos({ x: r.left, y: r.top, instant: true })
        requestAnimationFrame(() => requestAnimationFrame(() => setPos(next)))
      } else {
        setPos(next)
      }
      onEscape()
    },
    [tired, spotAwayFrom, onEscape],
  )

  // Ordinateur : fuite dès que le curseur s'approche.
  useEffect(() => {
    if (tired) return
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !btnRef.current) return
      const r = btnRef.current.getBoundingClientRect()
      if (distToRect(e.clientX, e.clientY, r) < NEAR) flee({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [tired, flee])

  // Mobile : on intercepte le toucher avant le clic (écouteur non passif obligatoire).
  useEffect(() => {
    const btn = btnRef.current
    if (tired || !btn) return
    const onTouch = (e) => {
      e.preventDefault()
      const t = e.touches[0]
      flee(t ? { x: t.clientX, y: t.clientY } : null)
    }
    btn.addEventListener('touchstart', onTouch, { passive: false })
    return () => btn.removeEventListener('touchstart', onTouch)
  }, [tired, flee])

  // Fatigué : il revient tranquillement à sa place, à côté du « Oui ».
  useEffect(() => {
    if (!tired || !posRef.current) return
    const home = slotRef.current.getBoundingClientRect()
    setPos({ x: home.left, y: home.top })
    const t = setTimeout(
      () => {
        setPos(null)
        setSlot(null)
      },
      prefersReducedMotion() ? 0 : HOME_MS,
    )
    return () => clearTimeout(t)
  }, [tired])

  // Redimensionnement / défilement : il reste visible et ne chevauche jamais le « Oui ».
  useEffect(() => {
    if (!pos || tired) return
    const reflow = () => {
      const r = btnRef.current.getBoundingClientRect()
      const avoid = avoidRef.current?.getBoundingClientRect()
      const { w, h } = viewport()
      const outside = r.left < 0 || r.top < 0 || r.right > w || r.bottom > h
      if (outside || (avoid && overlaps(r, avoid, AVOID_PAD / 2))) {
        setPos({ ...spotAwayFrom(null), instant: true })
      }
    }
    window.addEventListener('resize', reflow)
    window.addEventListener('scroll', reflow, { passive: true })
    return () => {
      window.removeEventListener('resize', reflow)
      window.removeEventListener('scroll', reflow)
    }
  }, [pos, tired, avoidRef, spotAwayFrom])

  const onPointerDown = (e) => {
    if (tired || e.pointerType !== 'mouse') return
    e.preventDefault()
    flee({ x: e.clientX, y: e.clientY })
  }

  // detail === 0 : activation au clavier → la réponse « non » reste toujours possible.
  const onClick = (e) => {
    if (tired || e.detail === 0) onChoose()
    else flee(null)
  }

  const classes = ['btn', 'btn-no']
  if (pos) classes.push('is-loose')
  if (pos?.instant) classes.push('no-anim')

  return (
    <span
      ref={slotRef}
      className="runaway-slot"
      style={slot ? { width: slot.w, height: slot.h } : undefined}
    >
      <button
        ref={btnRef}
        type="button"
        className={classes.join(' ')}
        style={pos ? { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` } : undefined}
        onPointerDown={onPointerDown}
        onClick={onClick}
      >
        {children}
      </button>
    </span>
  )
}
