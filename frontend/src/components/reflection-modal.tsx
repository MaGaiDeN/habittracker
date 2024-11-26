'use client'

import { X, BookOpen, Brain, Lightbulb } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'

type ReflectionModalProps = {
  onClose: () => void
  trackerId: string
  date: string
  initialData?: {
    contemplations?: string
    beliefs?: string
    shortcuts?: string
    defaultContemplations?: string
    defaultBeliefs?: string
    defaultShortcuts?: string
  }
  onComplete: () => void
}

export default function ReflectionModal({ 
  onClose, 
  trackerId, 
  date,
  initialData,
  onComplete
}: ReflectionModalProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  const updateEntryMutation = useMutation({
    mutationFn: async (data: {
      contemplations?: string
      beliefs?: string
      shortcuts?: string
    }) => {
      if (!token) throw new Error('No hay token')
      return api.updateDailyEntry(token, trackerId, date, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      onClose()
    }
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Reflexión Diaria</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          updateEntryMutation.mutate({
            contemplations: formData.get('contemplations') as string,
            beliefs: formData.get('beliefs') as string,
            shortcuts: formData.get('shortcuts') as string,
          })
        }}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <BookOpen className="mr-2 text-indigo-500" />
                Preguntas de Contemplación
              </h3>
              <textarea 
                name="contemplations"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                placeholder="Escribe tus contemplaciones aquí..."
                defaultValue={initialData?.contemplations || initialData?.defaultContemplations}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <Brain className="mr-2 text-indigo-500" />
                Creencias
              </h3>
              <textarea 
                name="beliefs"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                placeholder="Escribe tus creencias aquí..."
                defaultValue={initialData?.beliefs || initialData?.defaultBeliefs}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <Lightbulb className="mr-2 text-indigo-500" />
                Atajos
              </h3>
              <textarea 
                name="shortcuts"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                placeholder="Escribe tus atajos aquí..."
                defaultValue={initialData?.shortcuts || initialData?.defaultShortcuts}
              />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 