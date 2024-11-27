import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // Generar token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt:', {
      body: req.body,
      headers: req.headers
    })
    
    const { email, password } = req.body

    // Usuario de prueba - crear si no existe
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    })

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('123456', 10)
      await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: hashedPassword,
          name: 'Usuario de Prueba'
        }
      })
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    res.json({ token })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
} 