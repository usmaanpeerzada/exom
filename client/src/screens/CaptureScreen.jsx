import { useRef, useState } from 'react'
import CameraModal from '../components/CameraModal'
import HistoryView from '../components/HistoryView'

const EXAM_STYLES = {
  JEE:  { bg: 'bg-blue-500',    blob: 'bg-blue-400',    btn: 'bg-blue-600 shadow-blue-200',    light: 'bg-blue-50 text-blue-600',   label: 'JEE',  emoji: '⚡', tagline: 'Find JEE Main & Advanced PYQs' },
  NEET: { bg: 'bg-emerald-500', blob: 'bg-emerald-400', btn: 'bg-emerald-600 shadow-emerald-200', light: 'bg-emerald-50 text-emerald-600', label: 'NEET', emoji: '🧬', tagline: 'Find NEET UG PYQs instantly' },
  CUET: { bg: 'bg-orange-500',  blob: 'bg-orange-400',  btn: 'bg-orange-500 shadow-orange-200',  light: 'bg-orange-50 text-orange-600',  label: 'CUET', emoji: '🎓', tagline: 'Find CUET PYQs for your subject' },
  CBSE: { bg: 'bg-violet-500',  blob: 'bg-violet-400',  btn: 'bg-violet-600 shadow-violet-200',  light: 'bg-violet-50 text-violet-600',  label: 'CBSE', emoji: '📚', tagline: 'Find CBSE board PYQs instantly' },
}

export default function CaptureScreen({ exam, onImage, onDoubt, onChangeExam, onProgress, history, onSelectHistory, onClearHistory, hasProgress }) {
  const galleryRef = useRef()
  const doubtGalleryRef = useRef()
  const [showCamera, setShowCamera] = useState(false)
  const [cameraMode, setCameraMode] = useState('pyq') // 'pyq' | 'doubt'
  const style = EXAM_STYLES[exam]

  function handleFile(e, mode) {
    const file = e.target.files?.[0]
    if (file) {
      mode === 'doubt' ? onDoubt(file) : onImage(file)
      e.target.value = ''
    }
  }

  function handleCapture(file) {
    setShowCamera(false)
    cameraMode === 'doubt' ? onDoubt(file) : onImage(file)
  }

  function openCamera(mode) {
    setCameraMode(mode)
    setShowCamera(true)
  }

  return (
    <>
      {showCamera && <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      <div className="min-h-screen flex flex-col max-w-md mx-auto">
        {/* Coloured hero */}
        <div className={`relative overflow-hidden ${style.bg} px-6 pt-14 pb-10`}>
          <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${style.blob} opacity-40 blur-3xl`} />

          {/* Top row */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h1 className="text-xl font-black text-white tracking-tight">
              Exom<span className="text-yellow-300">.</span>
            </h1>
            <div className="flex items-center gap-2">
              {hasProgress && (
                <button onClick={onProgress} className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                  <span className="text-white text-xs">📊</span>
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

          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">{style.tagline}</p>
            <h2 className="text-white text-3xl font-black leading-tight">
              Snap your<br />notes {style.emoji}
            </h2>
          </div>

          <div className="relative z-10 mt-6 bg-white/15 backdrop-blur rounded-3xl p-6 flex items-center justify-center min-h-[90px]">
            <div className="text-center">
              <div className="text-3xl mb-1.5">📄</div>
              <p className="text-white/80 text-xs font-medium">Textbook page, handwritten notes,<br />printed material — anything works</p>
            </div>
          </div>
        </div>

        {/* White action section */}
        <div className="flex-1 bg-gray-50 px-5 pt-6 pb-8 flex flex-col gap-5">

          {/* PYQ mode */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Get PYQs</p>
            <button
              onClick={() => openCamera('pyq')}
              className={`w-full flex items-center justify-center gap-3 py-4 ${style.btn} text-white rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload from Gallery
            </button>
          </div>

          {/* Doubt mode */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Got a Doubt?</p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={() => openCamera('doubt')}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              <span className="text-base">🤔</span>
              Snap & Explain This
            </button>
            <button
              onClick={() => doubtGalleryRef.current.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-400 text-xs font-medium active:text-gray-600"
            >
              Upload doubt from gallery
            </button>
          </div>

          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'pyq')} />
          <input ref={doubtGalleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'doubt')} />

          {/* History */}
          <HistoryView history={history} onSelect={onSelectHistory} onClear={onClearHistory} />
        </div>
      </div>
    </>
  )
}
