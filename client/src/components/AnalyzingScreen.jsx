import { useEffect, useState } from 'react'

const STEPS = {
  pyq: [
    { label: 'Reading your content', delay: 0 },
    { label: 'Identifying topic and subject', delay: 1200 },
    { label: 'Finding PYQs', delay: 2800 },
  ],
  doubt: [
    { label: 'Analyzing your content', delay: 0 },
    { label: 'Understanding the concept', delay: 1200 },
    { label: 'Building explanation', delay: 2800 },
  ],
}

const EXAM_STYLE = {
  JEE:  { bg: 'bg-blue-500',    ring: 'border-blue-400',    dot: 'bg-blue-500' },
  NEET: { bg: 'bg-emerald-500', ring: 'border-emerald-400', dot: 'bg-emerald-500' },
  CUET: { bg: 'bg-orange-500',  ring: 'border-orange-400',  dot: 'bg-orange-500' },
  CBSE: { bg: 'bg-violet-500',  ring: 'border-violet-400',  dot: 'bg-violet-500' },
}

export default function AnalyzingScreen({ exam, preview, mode = 'pyq' }) {
  const [step, setStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const steps = STEPS[mode] || STEPS.pyq
  const style = EXAM_STYLE[exam] || { bg: 'bg-indigo-500', ring: 'border-indigo-400', dot: 'bg-indigo-500' }

  useEffect(() => {
    setStep(0)
    setElapsed(0)
    const timers = steps.slice(1).map((s, i) =>
      setTimeout(() => setStep(i + 1), s.delay)
    )
    const ticker = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => { timers.forEach(clearTimeout); clearInterval(ticker) }
  }, [mode])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* Colored header — matches other screens */}
      <div className={`${style.bg} px-6 pt-14 pb-8 relative overflow-hidden`}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-xl font-black text-white tracking-tight mb-1">
          Exom<span className="text-yellow-300">.</span>
        </h1>
        <p className="text-white/70 text-sm font-medium">
          {mode === 'doubt' ? 'Solving your doubt...' : 'Finding PYQs...'}
        </p>
      </div>

      {/* Preview photo (if uploaded) */}
      {preview && (
        <div className="relative h-44 overflow-hidden">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 py-10">

        {/* Spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-4 ${style.ring} opacity-20`} />
          <svg
            className={`absolute inset-0 w-20 h-20 animate-spin ${style.dot.replace('bg-', 'text-')}`}
            fill="none" viewBox="0 0 80 80"
          >
            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4"
              strokeDasharray="160" strokeDashoffset="120" strokeLinecap="round" />
          </svg>
          <span className="text-2xl">
            {mode === 'doubt' ? '🤔' : '📝'}
          </span>
        </div>

        {/* Step list */}
        <div className="w-full flex flex-col gap-3">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 transition-all duration-500 ${
                i <= step ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                i < step
                  ? `${style.dot}`
                  : i === step
                  ? `${style.dot} animate-pulse`
                  : 'bg-gray-200'
              }`}>
                {i < step ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${i <= step ? 'bg-white' : 'bg-gray-400'}`} />
                )}
              </div>
              <span className={`text-sm font-semibold ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>
                {s.label}
                {i === step && <span className="animate-pulse"> ...</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Timer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-gray-800 font-bold text-sm tabular-nums">{elapsed}s</span>
          <span className="text-gray-400 text-sm">usually takes 10-20s</span>
        </div>
      </div>
    </div>
  )
}
