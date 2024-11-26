import { useState } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const logout = () => {
    setIsAuthenticated(false)
    // Aquí añadirás la lógica real de logout más adelante
  }

  return {
    isAuthenticated,
    logout
  }
} 