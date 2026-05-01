import 'dotenv/config'
import Groq from 'groq-sdk'

const keys = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
].filter(Boolean)

if (keys.length === 0) throw new Error('No GROQ_API_KEY set')

console.log(`[keys] ${keys.length} Groq API key(s) loaded`)

export async function groqRequest(fn) {
  let lastErr
  for (const key of keys) {
    try {
      const groq = new Groq({ apiKey: key })
      return await fn(groq)
    } catch (err) {
      if (err.status === 429) {
        lastErr = err
        continue
      }
      throw err
    }
  }
  throw lastErr
}
