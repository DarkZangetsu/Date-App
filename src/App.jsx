import { useCallback, useEffect, useRef, useState } from 'react'
import Background from './components/Background.jsx'
import Confetti from './components/Confetti.jsx'
import AskStep from './components/AskStep.jsx'
import SoftNoStep from './components/SoftNoStep.jsx'
import PlanStep from './components/PlanStep.jsx'
import DoneStep from './components/DoneStep.jsx'
import { prefersReducedMotion } from './utils/motion.js'

const LEAVE_MS = 360

export default function App() {
  const [step, setStep] = useState('ask')
  const [leaving, setLeaving] = useState(false)
  const [plan, setPlan] = useState({ date: '', time: '' })
  const [party, setParty] = useState(0)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const goTo = useCallback((next, { celebrate = false } = {}) => {
    clearTimeout(timer.current)
    const enter = () => {
      setStep(next)
      setLeaving(false)
      window.scrollTo(0, 0)
      if (celebrate) setParty((n) => n + 1)
    }
    if (prefersReducedMotion()) return enter()
    setLeaving(true)
    timer.current = setTimeout(enter, LEAVE_MS)
  }, [])

  const sayYes = () => goTo('plan', { celebrate: true })

  return (
    <>
      <Background />
      {party > 0 && <Confetti key={party} />}
      <main className={`stage${leaving ? ' is-leaving' : ''}`}>
        {step === 'ask' && <AskStep onYes={sayYes} onNo={() => goTo('no')} />}
        {step === 'no' && <SoftNoStep onYes={sayYes} />}
        {step === 'plan' && (
          <PlanStep
            plan={plan}
            onChange={setPlan}
            onConfirm={() => goTo('done', { celebrate: true })}
          />
        )}
        {step === 'done' && <DoneStep plan={plan} onEdit={() => goTo('plan')} />}
      </main>
    </>
  )
}
