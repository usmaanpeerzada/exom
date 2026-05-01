import { useState } from 'react'

const YEAR_COLORS = {
  JEE:  'bg-blue-50 text-blue-600',
  NEET: 'bg-emerald-50 text-emerald-600',
  CUET: 'bg-orange-50 text-orange-600',
  CBSE: 'bg-violet-50 text-violet-600',
}

const ANSWER_COLORS = {
  JEE:  'bg-blue-600',
  NEET: 'bg-emerald-600',
  CUET: 'bg-orange-500',
  CBSE: 'bg-violet-600',
}

let _audioCtx = null
function getCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (_audioCtx.state === 'suspended') _audioCtx.resume()
  return _audioCtx
}

function playSound(correct) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    if (correct) {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } else {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    }
  } catch {}
}

function getOptionLetter(opt) {
  return opt.match(/^\(([A-D])\)/)?.[1] || null
}

function isCorrectOption(opt, answer) {
  const letter = getOptionLetter(opt)
  return letter && answer && answer.toUpperCase().includes(letter)
}

function shareOnWhatsApp(question, answer, explanation) {
  const text = `*Question:*\n${question}\n\n*Answer:* ${answer}\n\n*Explanation:* ${explanation}\n\n_via Exom_`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

export default function PYQCard({ pyq, index, exam, practiceMode, onAnswer }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const { year, paper, question, options, answer, explanation } = pyq

  const hasOptions = options && options.length > 0
  const isAnswered = selected !== null

  function handleOptionClick(opt) {
    if (!practiceMode || isAnswered) return
    const correct = isCorrectOption(opt, answer)
    setSelected(opt)
    onAnswer?.(correct)
    playSound(correct)
  }

  function getOptionStyle(opt) {
    if (practiceMode) {
      if (!isAnswered) return 'bg-gray-50 border border-transparent text-gray-700 active:bg-indigo-50 active:border-indigo-200 cursor-pointer'
      if (isCorrectOption(opt, answer)) return 'bg-green-50 border border-green-200 text-green-800 font-semibold'
      if (selected === opt) return 'bg-red-50 border border-red-200 text-red-700'
      return 'bg-gray-50 border border-transparent text-gray-400'
    }
    if (open && isCorrectOption(opt, answer)) return 'bg-green-50 border border-green-200 text-green-800 font-semibold'
    return 'bg-gray-50 border border-transparent text-gray-600'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-300">Q{index + 1}</span>
          {year && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${YEAR_COLORS[exam]}`}>
              {year}
            </span>
          )}
          {paper && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {paper}
            </span>
          )}
        </div>
        <button
          onClick={() => shareOnWhatsApp(question, answer, explanation || '')}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-green-50 active:bg-green-100"
          title="Share on WhatsApp"
        >
          <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.531 5.843L.057 23.571l5.88-1.544A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.49.917.932-3.4-.24-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </button>
      </div>

      {/* Question */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-sm leading-relaxed font-medium">{question}</p>
      </div>

      {/* Options */}
      {hasOptions && (
        <div className="px-4 pb-3 flex flex-col gap-1.5">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(opt)}
              disabled={!practiceMode || isAnswered}
              className={`w-full text-left text-sm rounded-xl px-3 py-2.5 leading-snug transition-colors duration-200 ${getOptionStyle(opt)}`}
            >
              {practiceMode && isAnswered && isCorrectOption(opt, answer) && <span className="mr-1.5">✓</span>}
              {practiceMode && isAnswered && selected === opt && !isCorrectOption(opt, answer) && <span className="mr-1.5">✗</span>}
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Practice mode: explanation after answering */}
      {practiceMode && isAnswered && explanation && (
        <div className="mx-4 mb-3 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Study mode: reveal answer */}
      {!practiceMode && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/40 active:bg-gray-100 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-400">
              {open ? 'Hide answer' : 'Reveal answer'}
            </span>
            <svg className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="px-4 py-4 border-t border-gray-50 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold text-white px-3 py-1.5 rounded-xl ${ANSWER_COLORS[exam]}`}>
                  {answer}
                </span>
                <span className="text-xs text-gray-400 font-medium">Correct Answer</span>
              </div>
              {explanation && <p className="text-xs text-gray-500 leading-relaxed">{explanation}</p>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
