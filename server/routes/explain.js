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

router.post('/explain', async (req, res) => {
  const { topic, subject, exam } = req.body
  if (!topic) return res.status(400).json({ error: 'Topic is required.' })

  try {
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are an expert tutor for Indian competitive exams${exam ? ` (${EXAM_CONTEXT[exam]})` : ''}.

Explain this topic clearly for a student: "${topic}"${subject ? ` from ${subject}` : ''}

Write all math in plain text only — no LaTeX, no backslashes. Use "a/b" for fractions, "x^2" for powers, "alpha/beta/theta" for Greek letters.

Return ONLY raw JSON, no markdown:
{
  "topic": "topic name",
  "subject": "subject name",
  "steps": [
    { "heading": "What is this?", "content": "clear explanation in 2-3 sentences" },
    { "heading": "How does it work?", "content": "explanation" },
    { "heading": "Step-by-step", "content": "walkthrough or derivation" },
    { "heading": "Key formula / rule", "content": "the most important thing to remember" }
  ],
  "keyPoints": ["point 1", "point 2", "point 3"],
  "example": "a simple worked example in plain text"
}`,
      }],
    })

    const raw = response.choices[0].message.content.trim()
    const data = safeParseJSON(raw)
    if (!data.topic || !Array.isArray(data.steps)) throw new Error('Unexpected structure')
    res.json(data)
  } catch (err) {
    console.error('[explain error]', err.message)
    res.status(500).json({ error: 'Could not explain this topic. Please try again.' })
  }
})

export default router
