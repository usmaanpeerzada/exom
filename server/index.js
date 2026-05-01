import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import analyzeRouter from './routes/analyze.js'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDist = join(__dirname, '../client/dist')

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many scans. Please wait a minute and try again.' },
})

app.use('/api/analyze', limiter)
app.use('/api', analyzeRouter)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

// Serve React app in production
if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_, res) => res.sendFile(join(clientDist, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Exom server running on http://localhost:${PORT}`))
