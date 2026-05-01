const EXAM_COLORS = {
  JEE:  'bg-blue-100 text-blue-600',
  NEET: 'bg-emerald-100 text-emerald-600',
  CUET: 'bg-orange-100 text-orange-600',
  CBSE: 'bg-violet-100 text-violet-600',
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function HistoryView({ history, onSelect, onClear }) {
  if (history.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Scans</p>
        <button onClick={onClear} className="text-[11px] text-gray-400 font-medium active:text-red-400">
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {history.slice(0, 5).map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3
                       text-left active:bg-gray-50 transition-colors shadow-sm"
          >
            <div className={`text-[10px] font-black px-2 py-1 rounded-lg flex-shrink-0 ${EXAM_COLORS[entry.exam]}`}>
              {entry.exam}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{entry.topic}</p>
              <p className="text-xs text-gray-400 truncate">{entry.subject} · {entry.chapter}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-gray-300 font-medium">{timeAgo(entry.timestamp)}</span>
              <span className="text-[10px] text-gray-400">{entry.pyqs?.length} Qs</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
