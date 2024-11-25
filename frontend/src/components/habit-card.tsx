'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'

type HabitCardProps = {
  habit: {
    id: string
    name: string
    description: string
    type: string
  }
}

export default function HabitCard({ habit }: HabitCardProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  const completeMutation = useMutation({
    mutationFn: () => api.completeHabit(token!, habit.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          <p className="text-gray-600 text-sm">{habit.description}</p>
          <span className="text-xs text-gray-500 mt-1 block">
            {habit.type === 'daily' ? 'Diario' : 'Semanal'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Editar</span>
            ✏️
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">Eliminar</span>
            🗑️
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
          className="px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
        >
          {completeMutation.isPending ? 'Completando...' : 'Completar hoy'}
        </button>
      </div>
    </div>
  )
} 