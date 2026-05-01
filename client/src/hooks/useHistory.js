import { useState } from 'react'

const KEY = 'exom_history'
const MAX = 20

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  function saveToHistory(exam, data) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      exam,
      topic: data.topic,
      subject: data.subject,
      chapter: data.chapter,
      pyqs: data.pyqs,
    }
    const updated = [entry, ...history].slice(0, MAX)
    setHistory(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem(KEY)
  }

  return { history, saveToHistory, clearHistory }
}
