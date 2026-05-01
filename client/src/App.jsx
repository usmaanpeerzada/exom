import { useState, useEffect } from 'react'
import IntroScreen from './screens/IntroScreen'
import ExamScreen from './screens/ExamScreen'
import CaptureScreen from './screens/CaptureScreen'
import AnalyzingScreen from './components/AnalyzingScreen'
import ResultsView from './components/ResultsView'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [exam, setExam] = useState(null)
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const { history, saveToHistory, clearHistory } = useHistory()

  // Warm up server immediately
  useEffect(() => { fetch('/health').catch(() => {}) }, [])

  function handleExamSelect(selectedExam) {
    setExam(selectedExam)
    setScreen('capture')
  }

  async function handleImage(file) {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
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
    setExam(entry.exam)
    setPreview(null)
    setStatus('results')
  }

  function resetToCapture() {
    setStatus('idle')
    setResults(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    setScreen('capture')
  }

  // Analyzing
  if (status === 'analyzing') {
    return <AnalyzingScreen exam={exam} preview={preview} />
  }

  // Results
  if (status === 'results') {
    return <ResultsView results={results} exam={exam} preview={preview} onReset={resetToCapture} />
  }

  // Error
  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-gray-900 font-bold text-lg mb-2 text-center">Something went wrong</h2>
        <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed max-w-xs">{error}</p>
        <button
          onClick={resetToCapture}
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Intro
  if (screen === 'intro') {
    return <IntroScreen onStart={() => setScreen('exam')} />
  }

  // Exam selection
  if (screen === 'exam') {
    return <ExamScreen onSelect={handleExamSelect} onBack={() => setScreen('intro')} />
  }

  // Capture
  return (
    <CaptureScreen
      exam={exam}
      onImage={handleImage}
      onChangeExam={() => setScreen('exam')}
      history={history}
      onSelectHistory={openFromHistory}
      onClearHistory={clearHistory}
    />
  )
}
