import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'

// Extender el tipo Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
      }
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Verificando autenticación...')
    const authHeader = req.headers.authorization

    if (!authHeader) {
      console.log('No se encontró header de autorización')
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    console.log('Token recibido:', token.substring(0, 20) + '...')
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string }
    console.log('Token decodificado:', decoded)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      console.log('Usuario no encontrado:', decoded.userId)
      return res.status(401).json({ message: 'Usuario no válido' })
    }

    console.log('Usuario autenticado:', user.id)
    req.user = { id: user.id }
    next()
  } catch (error) {
    console.error('Error en autenticación:', error)
    res.status(401).json({ 
      message: 'Token no válido',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
} 