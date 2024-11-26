'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { X } from 'lucide-react'

interface TrackerFormProps {
  onClose: () => void;
}

export default function TrackerForm({ onClose }: TrackerFormProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    courseName: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 29)),
    contemplations: '',
    beliefs: '',
    doors: `Tipos de Puertas a Observar:

- Momento de reacción vs respuesta
- Inicio de una emoción
- Transición entre pensamientos
- Estado de vigilia/sueño

Práctica:
1. Identifica la puerta
2. Respira
3. Elige conscientemente`,
    shortcuts: '',
    selfInquiry: '',
    notes: ''
  })

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
      if (!token) throw new Error('No hay token')
      return api.createTracker(token, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      onClose()
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error en mutation:', errorMessage)
      setError('Error al crear el tracker')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      courseName: formData.get('courseName') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('startDate') as string),
      contemplations: formData.get('contemplations') as string,
      beliefs: formData.get('beliefs') as string,
      doors: formData.get('doors') as string,
      shortcuts: formData.get('shortcuts') as string,
      selfInquiry: formData.get('selfInquiry') as string,
      notes: formData.get('notes') as string,
    }
    console.log('Datos a enviar:', data)

    createTrackerMutation.mutate(data)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Nuevo Tracker</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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

          <form id="tracker-form" onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Práctica de Puertas
              </label>
              <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Tipos de Puertas a Observar:</h4>
                  <div className="space-y-2">
                    {[
                      'Momento de reacción vs respuesta',
                      'Inicio de una emoción',
                      'Transición entre pensamientos',
                      'Estado de vigilia/sueño'
                    ].map((tipo, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={`doorType_${index}`}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-purple-700">{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-purple-900 mb-2">Práctica:</h4>
                  <div className="space-y-2">
                    {[
                      'Identifica la puerta',
                      'Respira',
                      'Elige conscientemente'
                    ].map((paso, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-purple-500 font-medium">{index + 1}.</span>
                        <span className="text-sm text-purple-700">{paso}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Atajos
              </label>
              <textarea
                name="shortcuts"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-indagación
              </label>
              <textarea
                name="selfInquiry"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notas
              </label>
              <textarea
                name="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="tracker-form"
              disabled={createTrackerMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createTrackerMutation.isPending ? 'Creando...' : 'Crear Tracker'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 