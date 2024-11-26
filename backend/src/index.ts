import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import trackerRoutes from './routes/tracker.routes'

dotenv.config()

const app = express()

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
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
}) 