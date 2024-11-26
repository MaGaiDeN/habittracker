'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'

export default function LoginPage() {
  const router = useRouter()
  const setToken = useAuthStore((state) => state.setToken)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { token } = await api.login(email, password)
      setToken(token)
      router.push('/dashboard')
    } catch (error) {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  const loginWithTestAccount = async () => {
    setError('')
    setLoading(true)

    try {
      const { token } = await api.login('test@test.com', '123456')
      setToken(token)
      router.push('/dashboard')
    } catch (error) {
      setError('Error al iniciar sesión con cuenta de prueba')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Iniciar Sesión</h2>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          
          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={loginWithTestAccount}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Usar cuenta de prueba'}
            </button>
            
            <div className="text-sm">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="text-blue-600 hover:text-blue-700">
                Regístrate aquí
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 