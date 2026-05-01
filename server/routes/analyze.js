import { Router } from 'express'
import { groqRequest } from '../keyManager.js'

const router = Router()

const EXAM_CONTEXT = {
  JEE:  'JEE Main and JEE Advanced (Physics, Chemistry, Mathematics)',
  NEET: 'NEET UG (Physics, Chemistry, Biology - Botany & Zoology)',
  CUET: 'CUET UG (domain subjects across streams)',
  CBSE: 'CBSE Class 11 & 12 board exams',
}

function safeParseJSON(raw) {
  let text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON object found in response')
  const fixed = match[0].replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
  return JSON.parse(fixed)
}

router.post('/analyze', async (req, res) => {
  const { image, mediaType, exam } = req.body

  if (!image || !exam) return res.status(400).json({ error: 'Image and exam type are required.' })
  if (!EXAM_CONTEXT[exam]) return res.status(400).json({ error: 'Invalid exam type.' })

  try {
    const response = await groqRequest((groq) =>
      groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType || 'image/jpeg'};base64,${image}` },
            },
            {
              type: 'text',
              text: `You are an expert on Indian competitive examinations. Analyze this image of student notes or a textbook page.

Target exam: ${exam} (${EXAM_CONTEXT[exam]})

Tasks:
1. Read the image carefully. Identify the SPECIFIC concept being shown — not just the chapter name, but the exact subtopic (e.g. not just "Kinematics" but "Relative motion on a moving belt", not just "Electrochemistry" but "Nernst equation applications").
2. Return 15 real previous year questions (PYQs) from ${exam} that test EXACTLY that specific concept. Every question must be directly relevant to what is visible in the image.

IMPORTANT formatting rules:
- Write all math in plain text only. No LaTeX, no backslashes, no special symbols.
- Write fractions as "a/b", powers as "x^2", Greek letters as their names (alpha, beta, theta).
- Respond ONLY with a raw JSON object. No explanation. No markdown. No code fences.

JSON format:
{
  "topic": "specific concept name",
  "subject": "subject name",
  "chapter": "chapter name",
  "pyqs": [
    {
      "year": "2023",
      "paper": "Paper 1, Shift 2",
      "question": "full question in plain text",
      "options": ["(A) ...", "(B) ...", "(C) ...", "(D) ..."],
      "answer": "(A)",
      "explanation": "1-2 sentence explanation in plain text."
    }
  ]
}

For "paper": include paper number, shift, and set where known (e.g. "Paper 1, Shift 2", "Phase 2, Set B", "Shift 1"). Leave empty string if unknown.
Omit "options" for non-MCQ questions. If the image is unreadable, return topic "Unrecognized" with empty pyqs array.`,
            },
          ],
        }],
      })
    )

    const raw = response.choices[0].message.content.trim()
    console.log('[raw]', raw.slice(0, 200))

    const data = safeParseJSON(raw)
    if (!data.topic || !Array.isArray(data.pyqs)) throw new Error('Unexpected response structure')

    res.json(data)
  } catch (err) {
    console.error('[analyze error]', err.message)
    if (err.status === 429) {
      return res.status(429).json({ error: 'All API keys are at their daily limit. Please try again tomorrow or contact support.' })
    }
    res.status(500).json({ error: 'Could not analyze the image. Please try again with a clearer photo.' })
  }
})

export default router
