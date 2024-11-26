'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { useState, useEffect, useRef } from 'react'

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
  const [showSettings, setShowSettings] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const completeMutation = useMutation({
    mutationFn: () => api.completeHabit(token!, habit.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteHabit(token!, habit.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
    onError: (error) => {
      console.error('Error al eliminar:', error)
      alert('No se pudo eliminar el hábito')
    }
  })

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      deleteMutation.mutate()
    }
  }

  const handleEdit = () => {
    // TODO: Implementar lógica de edición
    console.log('Editar hábito:', habit.id)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          <p className="text-gray-600 text-sm">{habit.description}</p>
          <span className="text-xs text-gray-500 mt-1 block">
            {habit.type === 'daily' ? 'Diario' : 'Semanal'}
          </span>
        </div>
        <div className="flex space-x-2">
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
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleEdit}
                >
                  Editar hábito
                </button>
                <button 
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  onClick={handleDelete}
                >
                  Eliminar hábito
                </button>
              </div>
            )}
          </div>
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