import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface EditTrackerModalProps {
  tracker: {
    id: string
    courseName: string
    contemplations: string | null
    beliefs: string | null
    shortcuts: string | null
    selfInquiry: string | null
  }
  onClose: () => void
}

export default function EditTrackerModal({ tracker, onClose }: EditTrackerModalProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const updateTrackerMutation = useMutation({
    mutationFn: async (data: {
      courseName: string
      contemplations?: string | undefined
      beliefs?: string | undefined
      shortcuts?: string | undefined
      selfInquiry?: string | undefined
    }) => {
      if (!token) throw new Error('No hay token')
      return api.updateTracker(token, tracker.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
      toast.success('Tracker actualizado correctamente')
      onClose()
    },
    onError: (error) => {
      setError('Error al actualizar el tracker')
      console.error(error)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      await updateTrackerMutation.mutateAsync({
        courseName: formData.get('courseName') as string,
        contemplations: formData.get('contemplations') as string || undefined,
        beliefs: formData.get('beliefs') as string || undefined,
        shortcuts: formData.get('shortcuts') as string || undefined,
        selfInquiry: formData.get('selfInquiry') as string || undefined
      })
    } catch (error) {
      console.error('Error al actualizar:', error)
      setError('No se pudo actualizar el tracker')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Editar Tracker</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}

          <form id="edit-tracker-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Tracker
              </label>
              <input
                name="courseName"
                defaultValue={tracker.courseName}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contemplaciones
              </label>
              <textarea
                name="contemplations"
                rows={3}
                defaultValue={tracker.contemplations || ''}
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
                defaultValue={tracker.beliefs || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Atajos
              </label>
              <textarea
                name="shortcuts"
                rows={3}
                defaultValue={tracker.shortcuts || ''}
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
                defaultValue={tracker.selfInquiry || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-tracker-form"
              disabled={updateTrackerMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateTrackerMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}