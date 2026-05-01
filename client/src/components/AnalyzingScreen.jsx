import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Reading your notes', delay: 0 },
  { label: 'Identifying topic & subject', delay: 1200 },
  { label: 'Finding PYQs', delay: 2800 },
]

const EXAM_RING = {
  JEE:  'border-blue-500',
  NEET: 'border-emerald-500',
  CUET: 'border-orange-500',
  CBSE: 'border-violet-500',
}

const EXAM_DOT = {
  JEE:  'bg-blue-500',
  NEET: 'bg-emerald-500',
  CUET: 'bg-orange-500',
  CBSE: 'bg-violet-500',
}

export default function AnalyzingScreen({ exam, preview }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = STEPS.slice(1).map((s, i) =>
      setTimeout(() => setStep(i + 1), s.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col max-w-md mx-auto">
      {/* Blurred preview */}
      {preview && (
        <div className="relative h-56 overflow-hidden">
          <img src={preview} alt="" className="w-full h-full object-cover scale-110 blur-md opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-950" />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 pb-20">
        {/* Animated ring */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 ${EXAM_RING[exam] || 'border-indigo-500'} opacity-20 animate-ping`} />
          <div className={`absolute inset-4 rounded-full border-2 ${EXAM_RING[exam] || 'border-indigo-500'} opacity-40 animate-ping [animation-delay:300ms]`} />
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <svg className="w-7 h-7 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 w-full">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`flex items-center gap-4 transition-opacity duration-500 ${i <= step ? 'opacity-100' : 'opacity-25'}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                i < step ? (EXAM_DOT[exam] || 'bg-indigo-500') :
                i === step ? `${EXAM_DOT[exam] || 'bg-indigo-500'} animate-pulse` :
                'bg-gray-600'
              }`} />
              <span className={`text-sm font-medium ${i <= step ? 'text-white' : 'text-gray-600'}`}>
                {s.label}
                {i === step && <span className="ml-1 animate-pulse">...</span>}
                {i < step && <span className="ml-1 text-green-400">✓</span>}
              </span>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-xs text-center">This takes about 10–15 seconds</p>
      </div>
    </div>
  )
}
