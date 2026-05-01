import CaptureZone from '../components/CaptureZone'
import HistoryView from '../components/HistoryView'

const EXAM_STYLES = {
  JEE:  { bg: 'bg-blue-500',    light: 'bg-blue-50 text-blue-600',    label: 'JEE' },
  NEET: { bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600', label: 'NEET' },
  CUET: { bg: 'bg-orange-500',  light: 'bg-orange-50 text-orange-600',  label: 'CUET' },
  CBSE: { bg: 'bg-violet-500',  light: 'bg-violet-50 text-violet-600',  label: 'CBSE' },
}

const EXAM_HINTS = {
  JEE:  'Kinematics, Organic Chemistry, Calculus...',
  NEET: 'Cell Biology, Thermodynamics, Reactions...',
  CUET: 'Any subject from your stream',
  CBSE: 'Any Class 11 or 12 topic',
}

export default function CaptureScreen({ exam, onImage, onChangeExam, history, onSelectHistory, onClearHistory }) {
  const style = EXAM_STYLES[exam]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Exom<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{EXAM_HINTS[exam]}</p>
          </div>

          {/* Exam badge — tap to change */}
          <button
            onClick={onChangeExam}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl ${style.light}`}
          >
            <span className="text-sm font-black">{style.label}</span>
            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 gap-6">
        {/* Capture zone */}
        <div className="flex-1 flex flex-col">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Snap Your Notes</p>
          <CaptureZone onImage={onImage} exam={exam} />
        </div>

        {/* History */}
        <HistoryView
          history={history}
          onSelect={onSelectHistory}
          onClear={onClearHistory}
        />
      </div>
    </div>
  )
}
