'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'

interface TrackerFormProps {
  onClose: () => void;
}

export default function TrackerForm({ onClose }: TrackerFormProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const createTrackerMutation = useMutation({
    mutationFn: async (data: {
      courseName: string;
      startDate: Date;
      endDate: Date;
      contemplations?: string;
      beliefs?: string;
      doors?: string;
      shortcuts?: string;
      selfInquiry?: string;
      notes?: string;
    }) => {
      console.log('Intentando crear tracker con datos:', data)
      try {
        const result = await api.createTracker(token!, data)
        console.log('Tracker creado exitosamente:', result)
        return result
      } catch (error) {
        console.error('Error al crear tracker:', error)
        throw error
      }
    },
    onSuccess: () => {
      console.log('Mutation exitosa, invalidando queries')
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      onClose()
    },
    onError: (error) => {
      console.error('Error en mutation:', error)
      setError('Error al crear el tracker')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 29) // 30 días en total

    createTrackerMutation.mutate({
      courseName: formData.get('courseName') as string,
      startDate,
      endDate,
      contemplations: formData.get('contemplations') as string,
      beliefs: formData.get('beliefs') as string,
      doors: formData.get('doors') as string,
      shortcuts: formData.get('shortcuts') as string,
      selfInquiry: formData.get('selfInquiry') as string,
      notes: formData.get('notes') as string,
    })
  }

  const handleTestTracker = () => {
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 29)

    createTrackerMutation.mutate({
      courseName: "Curso de Prueba",
      startDate,
      endDate,
      contemplations: "Preguntas de contemplación de ejemplo",
      beliefs: "Creencias de ejemplo",
      doors: "Puertas de ejemplo",
      shortcuts: "Atajos de ejemplo",
      selfInquiry: "Auto-indagación de ejemplo",
      notes: "Notas de ejemplo"
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nuevo Tracker</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={handleTestTracker}
          className="mb-4 text-sm text-blue-600 hover:text-blue-700"
        >
          Crear tracker de prueba
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Curso/Reto
            </label>
            <input
              type="text"
              name="courseName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="startDate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preguntas Contemplación
            </label>
            <textarea
              name="contemplations"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Creencias
            </label>
            <textarea
              name="beliefs"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createTrackerMutation.isPending}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createTrackerMutation.isPending ? 'Creando...' : 'Crear Tracker'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 