const EXAMS = [
  {
    id: 'JEE',
    name: 'JEE',
    full: 'Joint Entrance Exam',
    subjects: 'Physics · Chemistry · Maths',
    bg: 'bg-blue-500',
    blob: 'bg-blue-400',
    emoji: '⚡',
  },
  {
    id: 'NEET',
    name: 'NEET',
    full: 'National Eligibility Entrance',
    subjects: 'Physics · Chemistry · Biology',
    bg: 'bg-emerald-500',
    blob: 'bg-emerald-400',
    emoji: '🧬',
  },
  {
    id: 'CUET',
    name: 'CUET',
    full: 'Common University Entrance',
    subjects: 'All subjects across streams',
    bg: 'bg-orange-500',
    blob: 'bg-orange-400',
    emoji: '🎓',
  },
  {
    id: 'CBSE',
    name: 'CBSE',
    full: 'CBSE Board Exams',
    subjects: 'Class 11 & 12 all subjects',
    bg: 'bg-violet-500',
    blob: 'bg-violet-400',
    emoji: '📚',
  },
]

export default function ExamScreen({ onSelect, onBack }) {
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
        <h2 className="text-2xl font-black text-gray-900">Which exam are you<br />preparing for?</h2>
        <p className="text-sm text-gray-400 mt-1">We'll find PYQs from that exam's question bank.</p>
      </div>

      {/* Exam cards */}
      <div className="flex-1 px-5 py-6 grid grid-cols-2 gap-4 content-start">
        {EXAMS.map((exam) => (
          <button
            key={exam.id}
            onClick={() => onSelect(exam.id)}
            className={`relative overflow-hidden ${exam.bg} rounded-3xl p-5 text-left
                        active:scale-95 transition-transform shadow-lg`}
          >
            {/* Blob */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${exam.blob} opacity-50`} />

            <span className="text-3xl block mb-3 relative z-10">{exam.emoji}</span>
            <p className="text-white font-black text-xl leading-none relative z-10">{exam.name}</p>
            <p className="text-white/70 text-[11px] font-medium mt-1 relative z-10 leading-snug">{exam.subjects}</p>

            {/* Arrow */}
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-300 pb-10">You can change this later</p>
    </div>
  )
}
