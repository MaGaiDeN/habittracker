'use client'

import { useAuthStore } from '@/stores/auth.store'
import Link from 'next/link'

export function Navigation() {
  const { isAuthenticated, logout } = useAuthStore()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">HabitTracker</h1>
            {isAuthenticated && (
              <div className="ml-10 flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-900 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/estadisticas" 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Estadísticas
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {!isAuthenticated ? (
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 