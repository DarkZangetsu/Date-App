import { useFocusOnMount } from '../hooks/useFocusOnMount.js'
import { todayISO } from '../utils/date.js'

export default function PlanStep({ plan, onChange, onConfirm }) {
  const titleRef = useFocusOnMount()
  const set = (key) => (e) => onChange({ ...plan, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (plan.date) onConfirm()
  }

  return (
    <section className="step plan">
      <h1 className="title title-shout" ref={titleRef} tabIndex={-1}>
        OUIIIII&nbsp;!
        <span className="shout-emoji" aria-hidden="true">
          ❤️🎉
        </span>
      </h1>
      <p className="lede">Bon, maintenant, organisons ce fameux date&nbsp;! 😌</p>

      <form className="planner" onSubmit={submit}>
        <h2 className="planner-q">
          Alors, tu serais disponible quand&nbsp;? <span aria-hidden="true">📅</span>
        </h2>

        <div className="fields">
          <label className="field">
            <span className="field-label">Le jour</span>
            <input
              type="date"
              required
              min={todayISO()}
              value={plan.date}
              onChange={set('date')}
            />
          </label>
          <label className="field">
            <span className="field-label">
              L’heure <small>facultatif</small>
            </span>
            <input type="time" step="900" value={plan.time} onChange={set('time')} />
          </label>
        </div>

        <button type="submit" className="btn btn-yes btn-wide" disabled={!plan.date}>
          C’est notre rendez-vous ❤️
        </button>
      </form>
    </section>
  )
}
