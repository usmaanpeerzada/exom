import { useState } from 'react'

const KEY = 'exom_practice'

export function usePracticeHistory() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  function saveResult(topic, subject, exam, correct) {
    const entry = { topic, subject, exam, correct, timestamp: new Date().toISOString() }
    const updated = [...data, entry]
    setData(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  // Group by topic and calculate accuracy
  const topicMap = data.reduce((acc, entry) => {
    const key = `${entry.topic}__${entry.exam}`
    if (!acc[key]) acc[key] = { topic: entry.topic, subject: entry.subject, exam: entry.exam, correct: 0, total: 0 }
    acc[key].total++
    if (entry.correct) acc[key].correct++
    return acc
  }, {})

  const topics = Object.values(topicMap)
    .map(t => ({ ...t, accuracy: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)

  const weakTopics = topics.filter(t => t.accuracy < 70)
  const strongTopics = topics.filter(t => t.accuracy >= 70)

  return { topics, weakTopics, strongTopics, saveResult, hasData: data.length > 0 }
}
