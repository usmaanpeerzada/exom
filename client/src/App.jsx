import { useState, useEffect } from 'react'
import IntroScreen from './screens/IntroScreen'
import ExamScreen from './screens/ExamScreen'
import CaptureScreen from './screens/CaptureScreen'
import DoubtView from './screens/DoubtView'
import WeakTopicsView from './screens/WeakTopicsView'
import AnalyzingScreen from './components/AnalyzingScreen'
import ResultsView from './components/ResultsView'
import { useHistory } from './hooks/useHistory'
import { usePracticeHistory } from './hooks/usePracticeHistory'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [exam, setExam] = useState(null)
  const [status, setStatus] = useState('idle')
  const [mode, setMode] = useState('pyq') // 'pyq' | 'doubt'
  const [results, setResults] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const { history, saveToHistory, clearHistory } = useHistory()
  const { topics, weakTopics, strongTopics, hasData } = usePracticeHistory()

  useEffect(() => { fetch('/health').catch(() => {}) }, [])

  function handleExamSelect(selectedExam) {
    setExam(selectedExam)
    setScreen('capture')
  }

  async function processImage(file, currentMode) {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setMode(currentMode)
    setStatus('analyzing')
    setError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1]
      const mediaType = file.type || 'image/jpeg'
      const endpoint = currentMode === 'doubt' ? '/api/doubt' : '/api/analyze'

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mediaType, exam }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Analysis failed.')
        if (currentMode === 'pyq') saveToHistory(exam, data)
        setResults(data)
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
    setMode('pyq')
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
    return <AnalyzingScreen exam={exam} preview={preview} mode={mode} />
  }

  // Results
  if (status === 'results') {
    if (mode === 'doubt') {
      return <DoubtView result={results} exam={exam} preview={preview} onReset={resetToCapture} />
    }
    return <ResultsView results={results} exam={exam} preview={preview} onReset={resetToCapture} />
  }

  // Error
  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-gray-900 font-bold text-lg mb-2 text-center">Something went wrong</h2>
        <p className="text-gray-500 text-sm text-center mb-8 leading-relaxed max-w-xs">{error}</p>
        <button onClick={resetToCapture} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-95 transition-transform">
          Try Again
        </button>
      </div>
    )
  }

  if (screen === 'intro') return <IntroScreen onStart={() => setScreen('exam')} />
  if (screen === 'exam') return <ExamScreen onSelect={handleExamSelect} onBack={() => setScreen('intro')} />
  if (screen === 'progress') {
    return (
      <WeakTopicsView
        topics={topics}
        weakTopics={weakTopics}
        strongTopics={strongTopics}
        onBack={() => setScreen('capture')}
      />
    )
  }

  return (
    <CaptureScreen
      exam={exam}
      onImage={(file) => processImage(file, 'pyq')}
      onDoubt={(file) => processImage(file, 'doubt')}
      onChangeExam={() => setScreen('exam')}
      onProgress={() => setScreen('progress')}
      hasProgress={hasData}
      history={history}
      onSelectHistory={openFromHistory}
      onClearHistory={clearHistory}
    />
  )
}
