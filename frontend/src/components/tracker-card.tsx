'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

interface TrackerCardProps {
  tracker: Tracker;
}

export default function TrackerCard({ tracker }: TrackerCardProps) {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  const updateEntryMutation = useMutation({
    mutationFn: ({ date, completed }: { date: string; completed: boolean }) =>
      api.updateDailyEntry(token!, tracker.id, date, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers'] })
    },
  })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">{tracker.courseName}</h3>
          <p className="text-gray-500">
            {format(new Date(tracker.startDate), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Progreso Diario</h4>
        <div className="grid grid-cols-6 gap-2">
          {tracker.dailyEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => updateEntryMutation.mutate({
                date: format(new Date(entry.date), 'yyyy-MM-dd'),
                completed: !entry.completed
              })}
              className={`
                aspect-square rounded-md flex items-center justify-center text-sm
                ${entry.completed 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              `}
            >
              {format(new Date(entry.date), 'd')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {tracker.contemplations && (
          <div>
            <h4 className="font-medium">Preguntas Contemplación</h4>
            <p className="text-gray-600 whitespace-pre-line">{tracker.contemplations}</p>
          </div>
        )}
        
        {tracker.beliefs && (
          <div>
            <h4 className="font-medium">Creencias</h4>
            <p className="text-gray-600 whitespace-pre-line">{tracker.beliefs}</p>
          </div>
        )}

        {tracker.notes && (
          <div>
            <h4 className="font-medium">Notas</h4>
            <p className="text-gray-600 whitespace-pre-line">{tracker.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
} 