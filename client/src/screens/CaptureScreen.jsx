import { useRef, useState } from 'react'
import CameraModal from '../components/CameraModal'
import HistoryView from '../components/HistoryView'

const EXAM_STYLES = {
  JEE:  { bg: 'bg-blue-500',    blob: 'bg-blue-400',    btn: 'bg-blue-600 shadow-blue-200',    light: 'bg-blue-50 text-blue-600',    label: 'JEE',  emoji: '⚡' },
  NEET: { bg: 'bg-emerald-500', blob: 'bg-emerald-400', btn: 'bg-emerald-600 shadow-emerald-200', light: 'bg-emerald-50 text-emerald-600', label: 'NEET', emoji: '🧬' },
  CUET: { bg: 'bg-orange-500',  blob: 'bg-orange-400',  btn: 'bg-orange-500 shadow-orange-200',  light: 'bg-orange-50 text-orange-600',  label: 'CUET', emoji: '🎓' },
  CBSE: { bg: 'bg-violet-500',  blob: 'bg-violet-400',  btn: 'bg-violet-600 shadow-violet-200',  light: 'bg-violet-50 text-violet-600',  label: 'CBSE', emoji: '📚' },
}

const MODES = [
  { id: 'pyq',   label: 'Get PYQs',     icon: '📝' },
  { id: 'doubt', label: 'Solve Doubt',  icon: '🤔' },
]

export default function CaptureScreen({ exam, onImage, onDoubt, onChangeExam, onProgress, history, onSelectHistory, onClearHistory, hasProgress }) {
  const galleryRef = useRef()
  const [showCamera, setShowCamera] = useState(false)
  const [activeMode, setActiveMode] = useState('pyq')
  const style = EXAM_STYLES[exam]

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) {
      activeMode === 'doubt' ? onDoubt(file) : onImage(file)
      e.target.value = ''
    }
  }

  function handleCapture(file) {
    setShowCamera(false)
    activeMode === 'doubt' ? onDoubt(file) : onImage(file)
  }

  const isPyq = activeMode === 'pyq'

  return (
    <>
      {showCamera && <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      <div className="min-h-screen flex flex-col max-w-md mx-auto">

        {/* Coloured hero */}
        <div className={`relative overflow-hidden ${style.bg} px-6 pt-14 pb-8`}>
          <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${style.blob} opacity-40 blur-3xl`} />

          {/* Top row */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h1 className="text-xl font-black text-white tracking-tight">
              Exom<span className="text-yellow-300">.</span>
            </h1>
            <div className="flex items-center gap-2">
              {hasProgress && (
                <button onClick={onProgress} className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                  <span className="text-xs">📊</span>
                  <span className="text-white text-xs font-bold">Progress</span>
                </button>
              )}
              <button onClick={onChangeExam} className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                <span className="text-white text-xs font-black">{style.label}</span>
                <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mode tabs — right in the hero */}
          <div className="relative z-10 bg-white/15 rounded-2xl p-1 flex gap-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeMode === m.id
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-white/70'
                }`}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* White action section */}
        <div className="flex-1 bg-gray-50 px-5 pt-6 pb-8 flex flex-col gap-5">

          {/* Description card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center gap-3">
            <div className="text-3xl">{isPyq ? '📄' : '💡'}</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {isPyq ? 'Snap your notes or textbook' : 'Snap what you don\'t understand'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isPyq
                  ? `We'll find real ${exam} PYQs for your exact topic`
                  : 'We\'ll give you a step-by-step explanation'}
              </p>
            </div>
          </div>

          {/* Camera button */}
          <button
            onClick={() => setShowCamera(true)}
            className={`w-full flex items-center justify-center gap-3 py-4 text-white
                        rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg
                        ${isPyq ? style.btn : 'bg-indigo-600 shadow-indigo-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open Camera
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => galleryRef.current.click()}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-200
                       text-gray-700 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload from Gallery
          </button>

          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {/* History — only in PYQ mode */}
          {isPyq && (
            <HistoryView history={history} onSelect={onSelectHistory} onClear={onClearHistory} />
          )}
        </div>
      </div>
    </>
  )
}
