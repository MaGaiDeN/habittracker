import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

interface AuthRequest extends Request {
  user: { id: string }
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export const reflectionController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' })
      }
      const { date, emotion, observation, insights } = req.body
      const userId = req.user.id

      const reflection = await prisma.dailyreflection.create({
        data: {
          userId,
          date: new Date(date),
          emotion,
          observation,
          insights
        }
      })

      res.json(reflection)
    } catch (error) {
      res.status(500).json({ error: 'Error al guardar la reflexión' })
    }
  },

  getByDate: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' })
      }
      const { date } = req.params
      const userId = req.user.id

      const reflection = await prisma.dailyReflection.findFirst({
        where: {
          userId,
          date: new Date(date)
        }
      })

      res.json(reflection)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la reflexión' })
    }
  }
} 