import { useState } from 'react'
import PYQCard from './PYQCard'
import { usePracticeHistory } from '../hooks/usePracticeHistory'

const EXAM_COLORS = {
  JEE:  { badge: 'bg-blue-600',    bar: 'bg-blue-600',    light: 'bg-blue-50 text-blue-600' },
  NEET: { badge: 'bg-emerald-600', bar: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
  CUET: { badge: 'bg-orange-500',  bar: 'bg-orange-500',  light: 'bg-orange-50 text-orange-600' },
  CBSE: { badge: 'bg-violet-600',  bar: 'bg-violet-600',  light: 'bg-violet-50 text-violet-600' },
}

export default function ResultsView({ results, exam, preview, onReset, onGetExplanation }) {
  const { topic, subject, chapter, pyqs = [] } = results
  const colors = EXAM_COLORS[exam] || EXAM_COLORS.JEE

  const [practiceMode, setPracticeMode] = useState(true)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [allPyqs, setAllPyqs] = useState(pyqs)
  const [batch, setBatch] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const { saveResult } = usePracticeHistory()

  function handleAnswer(correct) {
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    saveResult(topic, subject, exam, correct)
  }

  function toggleMode() {
    setPracticeMode((m) => !m)
    setScore({ correct: 0, total: 0 })
  }

  async function loadMore() {
    setLoadingMore(true)
    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, exam, batch: batch + 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAllPyqs((prev) => [...prev, ...(data.pyqs || [])])
      setBatch((b) => b + 1)
    } catch {
      // silently fail — button stays visible to retry
    } finally {
      setLoadingMore(false)
    }
  }

  const scorePercent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onReset} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 flex-shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{topic}</p>
          <p className="text-xs text-gray-400 truncate">{subject} · {chapter}</p>
        </div>
        <span className={`text-[10px] font-black text-white px-2.5 py-1 rounded-full flex-shrink-0 ${colors.badge}`}>
          {exam}
        </span>
      </div>

      {/* Photo banner */}
      <div className="relative overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="Your notes" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white/60 text-xs font-medium mb-1">{subject} · {chapter}</p>
              <h2 className="text-white text-xl font-black leading-tight">{topic}</h2>
            </div>
          </>
        ) : (
          <div className={`${colors.bar} px-5 py-5`}>
            <p className="text-white/60 text-xs font-medium mb-1">{subject} · {chapter}</p>
            <h2 className="text-white text-xl font-black">{topic}</h2>
          </div>
        )}
      </div>

      {/* Stats + mode toggle */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
            <span className="text-xs font-semibold text-gray-500">{allPyqs.length} PYQs</span>
          </div>
          {practiceMode && score.total > 0 && (
            <>
              <div className="w-px h-3 bg-gray-200" />
              <span className="text-xs font-bold text-gray-700">
                {score.correct}/{score.total}
                {scorePercent !== null && (
                  <span className={`ml-1 ${scorePercent >= 60 ? 'text-green-500' : 'text-red-400'}`}>
                    ({scorePercent}%)
                  </span>
                )}
              </span>
            </>
          )}
        </div>

        <div className="bg-gray-100 rounded-xl p-1 flex">
          <button
            onClick={() => practiceMode && toggleMode()}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !practiceMode ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            Study
          </button>
          <button
            onClick={() => !practiceMode && toggleMode()}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              practiceMode ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            Practice
          </button>
        </div>
      </div>

      {/* PYQ list */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        {allPyqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold">No PYQs found</p>
            <p className="text-gray-400 text-sm mt-1">Try a clearer photo or different page</p>
          </div>
        ) : (
          <>
            {allPyqs.map((pyq, i) => (
              <PYQCard
                key={i}
                pyq={pyq}
                index={i}
                exam={exam}
                practiceMode={practiceMode}
                onAnswer={handleAnswer}
              />
            ))}

            {/* Load More */}
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Loading more questions...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Load 15 More PYQs
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-10 pt-3 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button
          onClick={() => onGetExplanation(topic, subject, exam)}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <span>🤔</span> Understand this Topic
        </button>
        <button onClick={onReset} className={`w-full py-3.5 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all ${colors.bar}`}>
          Scan Another Page
        </button>
      </div>
    </div>
  )
}
