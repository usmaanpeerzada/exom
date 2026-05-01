import { useRef, useState } from 'react'
import CameraModal from './CameraModal'

const EXAM_HINTS = {
  JEE:  'Kinematics, Organic Chemistry, Calculus...',
  NEET: 'Cell Biology, Thermodynamics, Reactions...',
  CUET: 'Any subject from your stream',
  CBSE: 'Any Class 11 or 12 topic',
}

export default function CaptureZone({ onImage, exam }) {
  const galleryRef = useRef()
  const [showCamera, setShowCamera] = useState(false)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) { onImage(file); e.target.value = '' }
  }

  function handleCapture(file) {
    setShowCamera(false)
    onImage(file)
  }

  return (
    <>
      {showCamera && (
        <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />
      )}

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex-1 min-h-[280px] bg-white rounded-3xl border border-gray-100 shadow-sm
                        flex flex-col items-center justify-center gap-4 px-6">
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-9 h-9 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-3xl border-2 border-indigo-200 animate-ping opacity-30" />
          </div>

          <div className="text-center">
            <p className="font-bold text-gray-800">Snap your notes or textbook</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{EXAM_HINTS[exam]}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={() => setShowCamera(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white
                         rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-indigo-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Camera
            </button>

            <button
              onClick={() => galleryRef.current.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-700
                         rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Gallery
            </button>
          </div>
        </div>

        <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <p className="text-center text-xs text-gray-300">Works best with clear, well-lit photos</p>
      </div>
    </>
  )
}
