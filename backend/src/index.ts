import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import trackerRoutes from './routes/tracker.routes'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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