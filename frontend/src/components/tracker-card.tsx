'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, CheckCircle, XCircle, AlertCircle, BookOpen, X } from 'lucide-react'
import { useState } from 'react'

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
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const updateEntryMutation = useMutation({
    mutationFn: async (data: {
      date: string;
      completed: boolean;
      contemplations?: string;
      beliefs?: string;
      shortcuts?: string;
    }) => {
      return api.updateDailyEntry(token!, tracker.id, data.date, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      setModalOpen(false)
    }
  })

  const getStatusColor = (status: boolean | null) => {
    const baseStyle = 'transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md'
    
    if (status === true) return `${baseStyle} bg-gradient-to-br from-green-500 to-green-600 text-white`
    if (status === false) return `${baseStyle} bg-red-100 border-2 border-red-300 text-red-500`
    return `${baseStyle} bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-200`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h3 className="text-xl font-bold text-white">{tracker.courseName}</h3>
        <p className="text-white/80">
          {format(new Date(tracker.startDate), "d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-10 gap-2">
          {tracker.dailyEntries.map((entry: any, index: number) => (
            <button 
              key={index}
              className={`w-8 h-8 rounded-lg focus:outline-none ${getStatusColor(entry.completed)}`}
              onClick={() => {
                setSelectedDay(index + 1)
                setModalOpen(true)
              }}
            >
              <span className="text-xs font-bold">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {modalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative m-4">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-8 h-8" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">
              Día {selectedDay} - Reflexión
            </h2>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const formData = new FormData(form)
              
              updateEntryMutation.mutate({
                date: tracker.dailyEntries[selectedDay - 1].date.toISOString(),
                completed: true,
                contemplations: formData.get('contemplations') as string,
                beliefs: formData.get('beliefs') as string,
                shortcuts: formData.get('shortcuts') as string,
              })
            }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-700">
                    <BookOpen className="inline-block mr-2 text-indigo-500" />
                    Preguntas de Contemplación
                  </h3>
                  <textarea 
                    name="contemplations"
                    className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Escribe tus reflexiones del día..."
                    defaultValue={tracker.dailyEntries[selectedDay - 1]?.contemplations || ''}
                  ></textarea>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-700">
                    Creencias a Cuestionar
                  </h3>
                  <textarea 
                    name="beliefs"
                    className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Escribe las creencias que identificaste hoy..."
                    defaultValue={tracker.dailyEntries[selectedDay - 1]?.beliefs || ''}
                  ></textarea>

                  <h3 className="font-semibold text-lg mt-4 mb-3 text-gray-700">
                    Atajos de Transformación
                  </h3>
                  <textarea 
                    name="shortcuts"
                    className="w-full h-20 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Escribe tus atajos o insights del día..."
                    defaultValue={tracker.dailyEntries[selectedDay - 1]?.shortcuts || ''}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={updateEntryMutation.isPending}
                >
                  {updateEntryMutation.isPending ? 'Guardando...' : 'Guardar Reflexión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 