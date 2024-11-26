'use client'

import { X, BookOpen, Brain, Lightbulb, CheckCircle } from 'lucide-react'
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
      completed?: boolean
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
      <div className="bg-white rounded-lg w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Reflexión Diaria</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                updateEntryMutation.mutate({ completed: true })
                onComplete?.()
              }}
              className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200"
            >
              <CheckCircle className="w-5 h-5" />
              Marcar como completado
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda: Guía y preguntas */}
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-indigo-700">
                Preguntas de Contemplación
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-indigo-900">
                  <h4 className="font-medium mb-2">Nivel Inicial:</h4>
                  <ul className="space-y-1 list-disc pl-4">
                    <li>¿Qué emociones estoy experimentando ahora?</li>
                    <li>¿De dónde vienen mis miedos?</li>
                    <li>¿Qué me impide estar en paz?</li>
                  </ul>
                </div>
                <div className="text-sm text-indigo-900">
                  <h4 className="font-medium mb-2">Nivel Avanzado:</h4>
                  <ul className="space-y-1 list-disc pl-4">
                    <li>¿Quién soy más allá de mis pensamientos?</li>
                    <li>¿Qué permanece cuando los pensamientos se detienen?</li>
                    <li>¿Cuál es mi verdadera naturaleza?</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-rose-700">
                Tipos de Creencias Limitantes
              </h3>
              <div className="space-y-3 text-sm text-rose-900">
                <div>
                  <h4 className="font-medium">Sobre uno mismo:</h4>
                  <ul className="list-disc pl-4">
                    <li>No soy suficientemente bueno</li>
                    <li>Nunca lograré mis metas</li>
                    <li>No merezco ser feliz</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Sobre los demás:</h4>
                  <ul className="list-disc pl-4">
                    <li>La gente no es de confianza</li>
                    <li>Todos me van a decepcionar</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-amber-700">
                Atajos de Transformación
              </h3>
              <div className="space-y-2 text-sm text-amber-900">
                <div className="space-y-1">
                  <h4 className="font-medium">Respiración Consciente:</h4>
                  <ul className="list-disc pl-4">
                    <li>Detente 3 segundos</li>
                    <li>Respira profundamente</li>
                    <li>Observa sin juzgar</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Práctica del Testigo:</h4>
                  <ul className="list-disc pl-4">
                    <li>Observa tus pensamientos como nubes</li>
                    <li>No te identifiques con ellos</li>
                    <li>Permite que pasen sin reaccionar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Áreas de escritura */}
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            updateEntryMutation.mutate({
              contemplations: formData.get('contemplations') as string,
              beliefs: formData.get('beliefs') as string,
              shortcuts: formData.get('shortcuts') as string,
            })
          }} className="space-y-6">
               <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <BookOpen className="mr-2 text-indigo-500" />
                Observación y Contemplación
              </h3>
              <textarea 
                name="contemplations"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200"
                placeholder="Registra tus observaciones sin juicio, describe sin drama y mantén la neutralidad..."
                defaultValue={initialData?.contemplations || initialData?.defaultContemplations}
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <Brain className="mr-2 text-rose-500" />
                Creencias Identificadas
              </h3>
              <textarea 
                name="beliefs"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-rose-200"
                placeholder="¿Qué creencias limitantes has identificado hoy? ¿De dónde vienen?"
                defaultValue={initialData?.beliefs || initialData?.defaultBeliefs}
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                <Lightbulb className="mr-2 text-amber-500" />
                Práctica y Transformación
              </h3>
              <textarea 
                name="shortcuts"
                className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-amber-200"
                placeholder="¿Qué atajos y prácticas has utilizado? ¿Cómo te han ayudado?"
                defaultValue={initialData?.shortcuts || initialData?.defaultShortcuts}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Guardar Reflexión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 