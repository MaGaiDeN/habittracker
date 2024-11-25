import { Request, Response } from 'express'
import prisma from '../config/database'

type HabitWithCompletions = {
  completions: { completedAt: Date }[]
}

export const createHabit = async (req: Request, res: Response) => {
  try {
    const { name, type, description } = req.body
    const userId = req.user?.id // Asumiendo que tenemos middleware de auth

    const habit = await prisma.habit.create({
      data: {
        name,
        type,
        description,
        userId
      }
    })

    res.status(201).json(habit)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear hábito' })
  }
}

export const getHabits = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    const habits = await prisma.habit.findMany({
      where: { userId }
    })

    res.json(habits)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener hábitos' })
  }
}

export const completeHabit = async (req: Request, res: Response) => {
  try {
    const { habitId } = req.params
    const userId = req.user?.id

    // Verificar que el hábito pertenece al usuario
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId
      }
    })

    if (!habit) {
      return res.status(404).json({ message: 'Hábito no encontrado' })
    }

    // Registrar completado
    const completion = await prisma.habitCompletion.create({
      data: {
        habitId,
        completedAt: new Date()
      }
    })

    res.json(completion)
  } catch (error) {
    res.status(500).json({ message: 'Error al completar hábito' })
  }
} 