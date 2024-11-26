import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@test.com'
      }
    })

    if (!existingUser) {
      // Crear usuario de prueba si no existe
      const hashedPassword = await bcrypt.hash('123456', 10)
      const testUser = await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: hashedPassword,
          name: 'Usuario de Prueba'
        }
      })
      
      // Crear un tracker de ejemplo para el usuario
      await prisma.tracker.create({
        data: {
          userId: testUser.id,
          courseName: 'Mi Primer Tracker',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          contemplations: '¿Qué emociones estoy experimentando hoy?\n¿Qué patrones observo en mis reacciones?',
          beliefs: 'Identifica tus creencias limitantes aquí',
          shortcuts: 'Anota los atajos de transformación que utilizas'
        }
      })

      console.log('✅ Usuario y tracker de prueba creados exitosamente')
    } else {
      console.log('ℹ️ El usuario de prueba ya existe')
    }
  } catch (error) {
    console.error('❌ Error al crear usuario de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()