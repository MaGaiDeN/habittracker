'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'

export default function StatsPage() {
  const token = useAuthStore((state) => state.token)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(token!),
    enabled: !!token,
  })

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Estadísticas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Hábitos Activos</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.totalHabits || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completados Hoy</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats?.completedToday || 0}/{stats?.totalHabits || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Progreso Semanal</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.weeklyProgress || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Racha más larga</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {stats?.longestStreak || 0} días
          </p>
        </div>
      </div>
    </div>
  )
} 