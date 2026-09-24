import React from 'react'
import { useAuth } from '../context/AuthContext'
import ResidentDashboard from './ResidentDashboard'
import GuardDashboard from './GuardDashboard'
import AdminDashboard from './AdminDashboard'

export default function Dashboard() {
  const { isAdmin, isGuard } = useAuth()

  if (isAdmin()) return <AdminDashboard />
  if (isGuard()) return <GuardDashboard />
  return <ResidentDashboard />
}
