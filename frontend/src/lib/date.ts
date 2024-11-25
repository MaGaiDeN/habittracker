export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
} 