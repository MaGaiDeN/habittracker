import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import trackerRoutes from './routes/tracker.routes'

dotenv.config()

const app = express()

// Health check endpoint con más información
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'configured' : 'missing',
    allowedOrigins: [
      'https://habittracker-lemon.vercel.app',
      'http://localhost:3000'
    ]
  })
})

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`)
  next()
})

app.use(cors({
  origin: [
    'https://habittracker-lemon.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/trackers', trackerRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Database configured:', !!process.env.DATABASE_URL)
}) 