import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (!res.ok) throw new Error('Error en login')
    return res.json()
  },

  async register(email: string, password: string, name: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })
    
    if (!res.ok) throw new Error('Error en registro')
    return res.json()
  },

  async getHabits(token: string) {
    const res = await fetch(`${API_URL}/habits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!res.ok) throw new Error('Error al obtener hábitos')
    return res.json()
  },

  async createHabit(token: string, data: { name: string; type: string; description?: string }) {
    const res = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!res.ok) throw new Error('Error al crear hábito')
    return res.json()
  },

  async completeHabit(token: string, habitId: string) {
    const res = await fetch(`${API_URL}/habits/${habitId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!res.ok) throw new Error('Error al completar hábito')
    return res.json()
  },

  getStats: (token: string): Promise<any> => {
    return axios.get('/api/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data)
  },

  async createTracker(token: string, data: {
    courseName: string;
    startDate: Date;
    endDate: Date;
    contemplations?: string;
    beliefs?: string;
    doors?: string;
    shortcuts?: string;
    selfInquiry?: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_URL}/trackers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al crear tracker')
    return res.json()
  },

  async getTrackers(token: string) {
    console.log('Haciendo fetch a:', `${API_URL}/trackers`)
    const response = await fetch(`${API_URL}/trackers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    
    if (!response.ok) {
      console.error('Error response:', response.status, await response.text())
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  async updateDailyEntry(token: string, trackerId: string, date: string, data: {
    completed: boolean;
    notes?: string;
  }) {
    const res = await fetch(`${API_URL}/trackers/${trackerId}/entries/${date}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar entrada')
    return res.json()
  },

  async updateTracker(token: string, trackerId: string, data: {
    contemplations?: string;
    beliefs?: string;
    doors?: string;
    shortcuts?: string;
    selfInquiry?: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_URL}/trackers/${trackerId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar tracker')
    return res.json()
  }
} 