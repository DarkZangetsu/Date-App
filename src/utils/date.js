const pad = (n) => String(n).padStart(2, '0')

/** Date du jour au format attendu par <input type="date"> (heure locale). */
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** « 19:30 » → « 19h30 », « 20:00 » → « 20h ». */
export function formatTime(time) {
  if (!time) return ''
  const [h, m] = time.split(':')
  return `${Number(h)}h${m === '00' ? '' : m}`
}

/** Découpe la date choisie en morceaux prêts à afficher. */
export function describePlan({ date, time }) {
  const [y, m, d] = date.split('-').map(Number)
  const value = new Date(y, m - 1, d)
  const sameYear = y === new Date().getFullYear()

  const weekday = value.toLocaleDateString('fr-FR', { weekday: 'long' })
  const dayMonth = value.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
  const hour = formatTime(time)

  return {
    weekday,
    dayMonth,
    hour,
    sentence: `${weekday} ${dayMonth}${hour ? ` à ${hour}` : ''}`,
  }
}
