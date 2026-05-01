const STEP_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500',
]

const EXAM_BADGE = {
  JEE:  'bg-blue-100 text-blue-700',
  NEET: 'bg-emerald-100 text-emerald-700',
  CUET: 'bg-orange-100 text-orange-700',
  CBSE: 'bg-violet-100 text-violet-700',
}

const EXAM_BTN = {
  JEE:  'bg-blue-600 shadow-blue-200',
  NEET: 'bg-emerald-600 shadow-emerald-200',
  CUET: 'bg-orange-500 shadow-orange-200',
  CBSE: 'bg-violet-600 shadow-violet-200',
}

export default function DoubtView({ result, exam, preview, onReset, onGetPYQs }) {
  const { topic, subject, steps = [], keyPoints = [], example } = result

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Sticky header */}
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
            <div className="px-4 py-3 flex items-center gap-3 bg-gray-50">
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

        {/* YouTube */}
        <button
          onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + exam + ' explanation')}`, '_blank')}
          className="w-full flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 active:bg-red-100 transition-colors"
        >
          <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <div className="text-left">
            <p className="text-red-700 font-bold text-sm">Watch on YouTube</p>
            <p className="text-red-400 text-xs mt-0.5 truncate">{topic} {exam} explanation</p>
          </div>
          <svg className="w-4 h-4 text-red-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>

        {/* Cross-navigation prompt */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 px-4 py-3.5 flex items-center gap-3">
          <span className="text-xl">📝</span>
          <div>
            <p className="text-blue-800 text-xs font-bold">Ready to test yourself?</p>
            <p className="text-blue-600 text-xs mt-0.5">Practice real exam questions on this exact topic</p>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-10 pt-3 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button
          onClick={() => onGetPYQs(topic, subject, exam)}
          className={`w-full py-4 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 ${EXAM_BTN[exam] || 'bg-indigo-600 shadow-indigo-200'}`}
        >
          <span>📝</span> Get PYQs for this Topic
        </button>
        <button
          onClick={onReset}
          className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
        >
          Snap Another
        </button>
      </div>
    </div>
  )
}
