'use client'

import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div>
      {/* tu componente aquí */}
    </div>
  )
} 