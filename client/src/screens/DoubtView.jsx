const STEP_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500',
]

const EXAM_BADGE = {
  JEE:  'bg-blue-100 text-blue-700',
  NEET: 'bg-emerald-100 text-emerald-700',
  CUET: 'bg-orange-100 text-orange-700',
  CBSE: 'bg-violet-100 text-violet-700',
}

export default function DoubtView({ result, exam, preview, onReset }) {
  const { topic, subject, steps = [], keyPoints = [], example } = result

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onReset} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 flex-shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{topic}</p>
          <p className="text-xs text-gray-400">{subject}</p>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 ${EXAM_BADGE[exam] || 'bg-indigo-100 text-indigo-700'}`}>
          {exam || 'Doubt'}
        </span>
      </div>

      {/* Photo banner */}
      {preview && (
        <div className="relative overflow-hidden">
          <img src={preview} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white/60 text-xs mb-1">{subject}</p>
            <h2 className="text-white text-lg font-black leading-tight">{topic}</h2>
          </div>
        </div>
      )}

      {/* Mode label */}
      <div className="bg-indigo-600 px-4 py-2.5 flex items-center gap-2">
        <span className="text-lg">🤔</span>
        <p className="text-white text-xs font-bold">Doubt Explanation</p>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4">
        {/* Steps */}
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`px-4 py-3 flex items-center gap-3 ${STEP_COLORS[i % STEP_COLORS.length]} bg-opacity-10`} style={{ backgroundColor: undefined }}>
              <div className={`w-7 h-7 rounded-full ${STEP_COLORS[i % STEP_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-black">{i + 1}</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{step.heading}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
            </div>
          </div>
        ))}

        {/* Key points */}
        {keyPoints.length > 0 && (
          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 px-4 py-4">
            <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <span>⭐</span> Key Points to Remember
            </p>
            <div className="flex flex-col gap-2">
              {keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5" />
                  <p className="text-gray-700 text-sm leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example */}
        {example && (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 px-4 py-4">
            <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <span>💡</span> Example
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">{example}</p>
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="px-4 pb-10 pt-2 bg-white border-t border-gray-100">
        <button onClick={onReset} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg shadow-indigo-200">
          Snap Another
        </button>
      </div>
    </div>
  )
}
