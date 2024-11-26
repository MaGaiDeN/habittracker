'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, CheckCircle, Trash2, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import ReflectionModal from './reflection-modal'
import { toast } from 'react-hot-toast'
import EditTrackerModal from './edit-tracker-modal'

interface DailyEntry {
  id: string;
  date: Date;
  completed: boolean;
  notes?: string;
  contemplations?: string;
  beliefs?: string;
  shortcuts?: string;
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

interface TrackerCardProps {
  tracker: Tracker;
}

export default function TrackerCard({ tracker }: TrackerCardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  // Añadir efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const deleteTrackerMutation = useMutation({
    mutationFn: () => api.deleteTracker(token!, tracker.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      toast?.success('Tracker eliminado correctamente')
    },
    onError: (error: Error) => {
      console.error('Error al eliminar:', error)
      toast?.error(error.message || 'No se pudo eliminar el tracker')
    }
  })

  const toggleCompleteMutation = useMutation({
    mutationFn: async (date: string) => {
      if (!token) throw new Error('No hay token')
      const currentEntry = tracker.dailyEntries.find(
        entry => format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(date), 'yyyy-MM-dd')
      )
      return api.updateDailyEntry(token, tracker.id, date, {
        completed: !currentEntry?.completed
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
    }
  })

  // Generar array de 30 días desde la fecha de inicio
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(tracker.startDate), i)
    const entry = tracker.dailyEntries.find(
      e => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
    return {
      date,
      completed: entry?.completed || false,
      hasReflection: !!(entry?.contemplations || entry?.beliefs || entry?.shortcuts)
    }
  })

  const progress = Math.round(
    (days.filter(day => day.completed).length / days.length) * 100
  )

  // Función de manejo del clic
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este tracker?')) {
      try {
        await deleteTrackerMutation.mutateAsync()
      } catch (error) {
        // El error ya será manejado por onError del useMutation
        // No necesitamos hacer nada más aquí
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">{tracker.courseName}</h3>
          <p className="text-white/80">
            {format(new Date(tracker.startDate), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button 
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setShowEditModal(true)
                    setShowSettings(false)
                  }}
                >
                  Editar tracker
                </button>
                <button 
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres eliminar este tracker?')) {
                      deleteTrackerMutation.mutate()
                    }
                    setShowSettings(false)
                  }}
                >
                  Eliminar tracker
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-10 gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index + 1)}
              className={`
                aspect-square rounded-lg p-1 flex flex-col items-center justify-center
                text-sm border transition-all
                ${day.completed 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }
                ${day.hasReflection ? 'ring-2 ring-blue-300' : ''}
              `}
            >
              <span className="font-medium">{index + 1}</span>
              {day.completed && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {day.hasReflection && (
                <Calendar className="w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Modal de reflexión */}
        {selectedDay && (
          <ReflectionModal
            trackerId={tracker.id}
            date={days[selectedDay - 1].date.toISOString()}
            initialData={{
              ...tracker.dailyEntries.find(
                entry => format(new Date(entry.date), 'yyyy-MM-dd') === 
                        format(days[selectedDay - 1].date, 'yyyy-MM-dd')
              ),
              defaultContemplations: tracker.contemplations,
              defaultBeliefs: tracker.beliefs,
              defaultShortcuts: tracker.shortcuts
            }}
            onClose={() => setSelectedDay(null)}
            onComplete={() => {
              toggleCompleteMutation.mutate(days[selectedDay - 1].date.toISOString())
            }}
          />
        )}

        {/* Nuevo modal de edición */}
        {showEditModal && (
          <EditTrackerModal
            tracker={{
              ...tracker,
              contemplations: tracker.contemplations ?? null,
              beliefs: tracker.beliefs ?? null,
              shortcuts: tracker.shortcuts ?? null,
              selfInquiry: tracker.selfInquiry ?? null
            }}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </div>
  )
} 