const EXAMS_META = {
  JEE:  { label: 'JEE',  sub: 'Maths · Phy · Chem',  active: 'bg-blue-600 shadow-blue-200',   idle: 'bg-white border border-blue-100 text-blue-600' },
  NEET: { label: 'NEET', sub: 'Bio · Phy · Chem',     active: 'bg-emerald-600 shadow-emerald-200', idle: 'bg-white border border-emerald-100 text-emerald-600' },
  CUET: { label: 'CUET', sub: 'All subjects',          active: 'bg-orange-500 shadow-orange-200',   idle: 'bg-white border border-orange-100 text-orange-500' },
  CBSE: { label: 'CBSE', sub: 'Class 11 & 12',          active: 'bg-violet-600 shadow-violet-200',   idle: 'bg-white border border-violet-100 text-violet-600' },
}

export default function ExamPicker({ exams, selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {exams.map((exam) => {
        const meta = EXAMS_META[exam]
        const isActive = exam === selected
        return (
          <button
            key={exam}
            onClick={() => onSelect(exam)}
            className={`flex flex-col items-center py-3 px-1 rounded-2xl transition-all active:scale-95 ${
              isActive ? `${meta.active} text-white shadow-lg` : meta.idle
            }`}
          >
            <span className="text-sm font-black">{meta.label}</span>
            <span className={`text-[9px] font-medium mt-0.5 leading-tight text-center ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
              {meta.sub}
            </span>
          </button>
        )
      })}
    </div>
  )
}
