import { useState } from 'react'
import ResultsView from '../components/ResultsView'

const EXAM_COLORS = {
  JEE:  { bar: 'bg-blue-500',    light: 'bg-blue-50 text-blue-600' },
  NEET: { bar: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
  CUET: { bar: 'bg-orange-500',  light: 'bg-orange-50 text-orange-600' },
  CBSE: { bar: 'bg-violet-500',  light: 'bg-violet-50 text-violet-600' },
}

function AccuracyBar({ accuracy }) {
  const color = accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 40 ? 'bg-orange-400' : 'bg-red-400'
  const label = accuracy >= 70 ? 'Strong' : accuracy >= 40 ? 'Needs work' : 'Weak'
  const labelColor = accuracy >= 70 ? 'text-emerald-600' : accuracy >= 40 ? 'text-orange-500' : 'text-red-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] font-bold ${labelColor}`}>{label}</span>
        <span className="text-xs font-bold text-gray-600">{accuracy}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${accuracy}%` }} />
      </div>
    </div>
  )
}

export default function WeakTopicsView({ topics, weakTopics, strongTopics, onBack }) {
  const [drilling, setDrilling] = useState(null) // { topic, subject, exam }
  const [drillResults, setDrillResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function drillTopic(t) {
    setDrilling(t)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t.topic, subject: t.subject, exam: t.exam }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDrillResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Show drill results
  if (drillResults) {
    return (
      <ResultsView
        results={drillResults}
        exam={drilling.exam}
        preview={null}
        onReset={() => { setDrillResults(null); setDrilling(null) }}
      />
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 max-w-md mx-auto">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bold">Generating practice set...</p>
          <p className="text-gray-400 text-sm mt-1">{drilling?.topic}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-2xl font-black text-gray-900">My Progress</h2>
        <p className="text-sm text-gray-400 mt-1">Based on your practice mode answers</p>
      </div>

      {topics.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <span className="text-5xl">📊</span>
          <h3 className="font-bold text-gray-800 text-lg">No data yet</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Use <strong>Practice mode</strong> on your PYQ results to start tracking your accuracy per topic.
          </p>
          <button onClick={onBack} className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm">
            Start Practicing
          </button>
        </div>
      ) : (
        <div className="flex-1 px-5 py-5 flex flex-col gap-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔴</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs More Practice</p>
              </div>
              <div className="flex flex-col gap-3">
                {weakTopics.map((t, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{t.topic}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${EXAM_COLORS[t.exam]?.light}`}>{t.exam}</span>
                          <span className="text-[10px] text-gray-400">{t.subject}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{t.correct}/{t.total} correct</span>
                    </div>
                    <AccuracyBar accuracy={t.accuracy} />
                    <button
                      onClick={() => drillTopic(t)}
                      className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-white ${EXAM_COLORS[t.exam]?.bar || 'bg-indigo-600'} active:scale-95 transition-transform`}
                    >
                      Practice {t.topic} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strong topics */}
          {strongTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🟢</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Strong Topics</p>
              </div>
              <div className="flex flex-col gap-3">
                {strongTopics.map((t, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{t.topic}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${EXAM_COLORS[t.exam]?.light}`}>{t.exam}</span>
                          <span className="text-[10px] text-gray-400">{t.subject}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{t.correct}/{t.total} correct</span>
                    </div>
                    <AccuracyBar accuracy={t.accuracy} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
