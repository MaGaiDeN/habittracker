'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { useState } from 'react'
import TrackerForm from '@/components/tracker-form'
import TrackerCard from '../../../components/tracker-card'

interface DailyEntry {
  id: string;
  date: Date;
  completed: boolean;
  notes?: string;
}

interface Tracker {
  id: string;
  courseName: string;
  startDate: Date;
  endDate: Date;
  contemplations?: string;
  beliefs?: string;
  doors?: string;
  shortcuts?: string;
  selfInquiry?: string;
  notes?: string;
  dailyEntries: DailyEntry[];
}

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token)
  const [showForm, setShowForm] = useState(false)

  const { data: trackers, isLoading, error } = useQuery({
    queryKey: ['trackers'],
    queryFn: async () => {
      console.log('Iniciando petición con token:', token)
      if (!token) throw new Error('No hay token')
      return api.getTrackers(token)
    },
    retry: 1
  })

  if (isLoading) return <div>Cargando trackers...</div>
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Error desconocido'}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mis Trackers</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Tracker
        </button>
      </div>

      {trackers?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes ningún tracker activo.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Crear tu primer tracker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {trackers?.map((tracker: Tracker) => (
            <TrackerCard key={tracker.id} tracker={tracker} />
          ))}
        </div>
      )}

      {showForm && <TrackerForm onClose={() => setShowForm(false)} />}
    </div>
  )
} 