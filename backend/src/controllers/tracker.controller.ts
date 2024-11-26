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
  try {
    const { courseName, startDate, endDate, contemplations, beliefs, shortcuts } = req.body
    const userId = req.user?.id

    console.log('Datos recibidos:', req.body)
    console.log('Usuario:', userId)

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    const tracker = await prisma.tracker.create({
      data: {
        courseName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        contemplations,
        beliefs,
        shortcuts
      }
    })

    res.status(201).json(tracker)
  } catch (error) {
    console.error('Error detallado:', error)
    res.status(500).json({ 
      message: 'Error al crear tracker',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export const updateTracker = async (req: Request, res: Response) => {
  // implementation
}

export const updateDailyEntry = async (req: Request, res: Response) => {
  try {
    const { trackerId, date } = req.params
    const { completed, contemplations, beliefs, shortcuts } = req.body
    const userId = req.user?.id

    // Verificar que el tracker pertenece al usuario
    const tracker = await prisma.tracker.findFirst({
      where: {
        id: trackerId,
        userId
      }
    })

    if (!tracker) {
      return res.status(404).json({ message: 'Tracker no encontrado' })
    }

    const updateData = {
      completed: completed === undefined ? undefined : completed,
      contemplations: contemplations === undefined ? undefined : contemplations,
      beliefs: beliefs === undefined ? undefined : beliefs,
      shortcuts: shortcuts === undefined ? undefined : shortcuts
    }

    const entry = await prisma.dailyEntry.upsert({
      where: {
        trackerId_date: {
          trackerId,
          date: new Date(date)
        }
      },
      update: updateData,
      create: {
        trackerId,
        date: new Date(date),
        ...updateData
      }
    })

    res.json(entry)
  } catch (error) {
    console.error('Error al actualizar entrada:', error)
    res.status(500).json({ message: 'Error al actualizar entrada' })
  }
}

export const deleteTracker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    // Primero verificamos que el tracker existe y pertenece al usuario
    const tracker = await prisma.tracker.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!tracker) {
      return res.status(404).json({ message: 'Tracker no encontrado' })
    }

    // Primero eliminamos los registros relacionados
    await prisma.$transaction([
      // Eliminar todos los registros diarios relacionados
      prisma.dailyEntry.deleteMany({
        where: { trackerId: id }
      }),
      // Finalmente eliminamos el tracker
      prisma.tracker.delete({
        where: { id }
      })
    ])

    return res.status(200).json({ message: 'Tracker eliminado correctamente' })

  } catch (error) {
    console.error('Error al eliminar tracker:', error)
    return res.status(500).json({ 
      message: 'Error al eliminar el tracker',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
} 