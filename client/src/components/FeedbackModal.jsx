import { useEffect, useState } from 'react'

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdRyGCbsAKclg97s3APHzD2GCpXyxZvFn81wu7ozJv5x5P0Dw/viewform'

export default function FeedbackModal() {
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('exom_feedback_done')) return

    const count = parseInt(localStorage.getItem('exom_scan_count') || '0', 10)
    if (count < 1) return

    const t = setTimeout(() => {
      setVisible(true)
      requestAnimationFrame(() => setAnimateIn(true))
    }, 10000)

    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setAnimateIn(false)
    setTimeout(() => setVisible(false), 300)
    localStorage.setItem('exom_feedback_done', '1')
  }

  function openForm() {
    window.open(FORM_URL, '_blank')
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center max-w-md mx-auto">
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Sheet */}
      <div className={`relative w-full bg-white rounded-t-3xl px-6 pt-5 pb-10 transition-transform duration-300 ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-lg leading-tight">How's Exom so far?</h3>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">Takes 30 seconds. Your feedback helps us improve.</p>
          </div>
        </div>

        <button
          onClick={openForm}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform shadow-lg shadow-indigo-200 mb-3"
        >
          Give Feedback
        </button>
        <button
          onClick={dismiss}
          className="w-full py-3 text-gray-400 text-sm font-medium"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
