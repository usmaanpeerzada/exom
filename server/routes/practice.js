import 'dotenv/config'
import { Router } from 'express'
import Groq from 'groq-sdk'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const EXAM_CONTEXT = {
  JEE:  'JEE Main and JEE Advanced (Physics, Chemistry, Mathematics)',
  NEET: 'NEET UG (Physics, Chemistry, Biology)',
  CUET: 'CUET UG (all domain subjects)',
  CBSE: 'CBSE Class 11 & 12',
}

function safeParseJSON(raw) {
  let text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found')
  const fixed = match[0].replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
  return JSON.parse(fixed)
}

router.post('/practice', async (req, res) => {
  const { topic, subject, exam } = req.body
  if (!topic || !exam) return res.status(400).json({ error: 'Topic and exam are required.' })

  try {
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: `You are an expert on Indian competitive exams. Generate focused practice questions.

Topic: ${topic}
Subject: ${subject || 'Unknown'}
Exam: ${exam} — ${EXAM_CONTEXT[exam]}

Return 10 real PYQs from ${exam} specifically on "${topic}". Write all math in plain text only — no LaTeX.

Return ONLY raw JSON:
{
  "topic": "${topic}",
  "subject": "${subject || ''}",
  "chapter": "chapter name",
  "pyqs": [
    {
      "year": "2022",
      "question": "question text",
      "options": ["(A) ...", "(B) ...", "(C) ...", "(D) ..."],
      "answer": "(A)",
      "explanation": "brief explanation"
    }
  ]
}`,
      }],
    })

    const raw = response.choices[0].message.content.trim()
    const data = safeParseJSON(raw)
    if (!data.pyqs) throw new Error('Unexpected structure')
    res.json(data)
  } catch (err) {
    console.error('[practice error]', err.message)
    res.status(500).json({ error: 'Could not generate questions. Try again.' })
  }
})

export default router
