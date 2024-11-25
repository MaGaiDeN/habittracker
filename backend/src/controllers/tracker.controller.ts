import { Request, Response } from 'express'
import prisma from '../config/database'

export const getTrackers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    console.log('Obteniendo trackers para usuario:', userId)

    const trackers = await prisma.tracker.findMany({
      where: { userId },
      include: {
        dailyEntries: {
          orderBy: {
            date: 'asc'
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    console.log(`Se encontraron ${trackers.length} trackers`)
    res.json(trackers)
  } catch (error) {
    console.error('Error al obtener trackers:', error)
    res.status(500).json({ 
      message: 'Error al obtener trackers',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export const createTracker = async (req: Request, res: Response) => {
  // implementation
}

export const updateTracker = async (req: Request, res: Response) => {
  // implementation
}

export const updateDailyEntry = async (req: Request, res: Response) => {
  // implementation
} 