import { useState } from 'react'
import { config } from '../config.js'
import { describePlan } from '../utils/date.js'
import { useFocusOnMount } from '../hooks/useFocusOnMount.js'

export default function DoneStep({ plan, onEdit }) {
  const titleRef = useFocusOnMount()
  const [status, setStatus] = useState('')
  const { weekday, dayMonth, hour, sentence } = describePlan(plan)
  const message = `C’est oui ❤️ Notre date : ${sentence}. Reste à choisir le programme 😏`

  const send = async () => {
    if (config.whatsapp) {
      // Lien direct (pas wa.me) : la redirection de wa.me abîme les emojis en « ? ».
      const url = `https://api.whatsapp.com/send?phone=${config.whatsapp}&text=${encodeURIComponent(message)}`
      window.open(url, '_blank', 'noopener')
      return
    }
    if (navigator.share) {
      try {
        await navigator.share({ text: message })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(message)
      setStatus('Message copié ! Il ne reste plus qu’à me l’envoyer 😌')
    } catch {
      setStatus(`À m’envoyer : « ${message} »`)
    }
  }

  return (
    <section className="step done">
      <p className="eyebrow">C’est officiel</p>
      <h1 className="title" ref={titleRef} tabIndex={-1}>
        Rendez-vous confirmé…
      </h1>
      <p className="lede lede-script">reste à choisir le programme 😏❤️</p>

      <div className="ticket">
        <span className="ticket-kicker">Toi &amp; moi</span>
        <span className="ticket-weekday">{weekday}</span>
        <span className="ticket-date">{dayMonth}</span>
        <span className="ticket-time">{hour ? `à ${hour}` : 'l’heure, on en parle'}</span>
      </div>

      <div className="choices">
        <button type="button" className="btn btn-yes" onClick={send}>
          Me prévenir 💌
        </button>
        <button type="button" className="btn btn-ghost" onClick={onEdit}>
          Changer la date
        </button>
      </div>
      <p className="tease" aria-live="polite">
        {status}
      </p>
    </section>
  )
}
