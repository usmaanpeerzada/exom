import { useState, useEffect } from 'react'
import ExamPicker from './components/ExamPicker'
import CaptureZone from './components/CaptureZone'
import AnalyzingScreen from './components/AnalyzingScreen'
import ResultsView from './components/ResultsView'
import HistoryView from './components/HistoryView'
import { useHistory } from './hooks/useHistory'

const EXAMS = ['JEE', 'NEET', 'CUET', 'CBSE']

export default function App() {
  const [exam, setExam] = useState('JEE')
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [activeExam, setActiveExam] = useState('JEE')
  const { history, saveToHistory, clearHistory } = useHistory()

  useEffect(() => { fetch('/health').catch(() => {}) }, [])

  async function handleImage(file) {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setActiveExam(exam)
    setStatus('analyzing')
    setError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1]
      const mediaType = file.type || 'image/jpeg'
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mediaType, exam }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Analysis failed.')
        setResults(data)
        saveToHistory(exam, data)
        setStatus('results')
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }
    reader.onerror = () => { setError('Could not read the image file.'); setStatus('error') }
    reader.readAsDataURL(file)
  }

  function openFromHistory(entry) {
    setResults({ topic: entry.topic, subject: entry.subject, chapter: entry.chapter, pyqs: entry.pyqs })
    setActiveExam(entry.exam)
    setPreview(null)
    setStatus('results')
  }

  function reset() {
    setStatus('idle')
    setResults(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
  }

  if (status === 'analyzing') return <AnalyzingScreen exam={exam} preview={preview} />
  if (status === 'results') return <ResultsView results={results} exam={activeExam} preview={preview} onReset={reset} />

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-gray-900 font-bold text-lg mb-2 text-center">Something went wrong</h2>
        <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed max-w-xs">{error}</p>
        <button onClick={reset} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-95 transition-transform">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Exom <span className="text-indigo-500">.</span></h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Snap notes → instant PYQs</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-sm">E</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 gap-6">
        {/* Exam Picker */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Target Exam</p>
          <ExamPicker exams={EXAMS} selected={exam} onSelect={setExam} />
        </div>

        {/* Capture */}
        <div className="flex-1 flex flex-col">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Notes</p>
          <CaptureZone onImage={handleImage} exam={exam} />
        </div>

        {/* History */}
        <HistoryView history={history} onSelect={openFromHistory} onClear={clearHistory} />
      </div>
    </div>
  )
}
