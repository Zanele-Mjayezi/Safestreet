import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password })
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (userData) => {
    const res = await authAPI.register(userData)
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isGuard = () => user?.role === 'GUARD'
  const isResident = () => user?.role === 'RESIDENT'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isGuard, isResident, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
