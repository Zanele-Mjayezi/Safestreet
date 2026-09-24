import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { publicAPI, incidentAPI, patrolAPI, emergencyAPI, subscriptionAPI } from '../api/client'
import useCountUp from '../hooks/useCountUp'
import {
  Shield, AlertTriangle, Users, TrendingUp, Siren, CreditCard,
  MapPin, Clock, CheckCircle
} from 'lucide-react'

function StatCard({ icon, iconClass, value, label, delay, prefix }) {
  const count = useCountUp(value || 0)
  return (
    <div className="stat-card animate-fade-in" style={{ animationDelay: delay }}>
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-value">{prefix}{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [patrols, setPatrols] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, incidentsRes, patrolsRes, emergenciesRes, subsRes] = await Promise.all([
        publicAPI.getStats(),
        incidentAPI.getAll(),
        patrolAPI.getActive(),
        emergencyAPI.getActive(),
        subscriptionAPI.getAll(),
      ])
      setStats(statsRes.data)
      setIncidents(incidentsRes.data)
      setPatrols(patrolsRes.data)
      setEmergencies(emergenciesRes.data)
      setSubscriptions(subsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const revenue = subscriptions
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (s.amount || 0), 0)

  const getStatusBadge = (status) => {
    const map = { ACTIVE: 'badge-active', PENDING: 'badge-pending', RESOLVED: 'badge-resolved' }
    return map[status] || 'badge-other'
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h1>Admin Overview</h1>
          <p>Welcome back, {user?.fullName || user?.username}. Here's the full picture across Khayelitsha.</p>
        </div>
        <span className="role-tag" style={{ marginLeft: 'auto' }}>Admin</span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={<Shield size={22} />} iconClass="primary" value={stats?.totalIncidents} label="Total Incidents" delay="0.05s" />
        <StatCard icon={<Siren size={22} />} iconClass="danger" value={emergencies.length} label="Active Emergencies" delay="0.1s" />
        <StatCard icon={<Users size={22} />} iconClass="accent" value={patrols.length} label="Guards On Duty" delay="0.15s" />
        <StatCard icon={<CreditCard size={22} />} iconClass="success" value={Math.round(revenue)} prefix="R" label="Active Subscription Revenue" delay="0.2s" />
      </div>

      {/* Active emergencies */}
      {emergencies.length > 0 && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--alert)' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Siren size={20} style={{ color: 'var(--alert)' }} /> Active Emergencies
            </h3>
            <span className="incident-badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot" /> {emergencies.length}
            </span>
          </div>
          <div className="card-body">
            <div className="incident-list">
              {emergencies.map((em) => (
                <div key={em.id} className="incident-item" style={{ borderLeftColor: 'var(--alert)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{em.user?.fullName || em.user?.username}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {em.location || 'Unknown'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {new Date(em.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: 24 }}>
        {/* Active patrols */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Guards On Duty</h3>
            <span className="incident-badge badge-active">{patrols.length}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {patrols.length === 0 ? (
              <div className="empty-state"><CheckCircle size={40} /><h3>No one on patrol</h3></div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>Guard</th><th>Area</th><th>Since</th></tr></thead>
                  <tbody>
                    {patrols.map(p => (
                      <tr key={p.id}>
                        <td>{p.guard?.fullName || p.guard?.username}</td>
                        <td>{p.patrolArea || 'Khayelitsha'}</td>
                        <td>{new Date(p.startTime).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Subscriptions</h3>
            <span className="incident-badge badge-pending">{subscriptions.length}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {subscriptions.length === 0 ? (
              <div className="empty-state"><CreditCard size={40} /><h3>No subscriptions yet</h3></div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>User</th><th>Plan</th><th>Status</th></tr></thead>
                  <tbody>
                    {subscriptions.slice(0, 8).map(s => (
                      <tr key={s.id}>
                        <td>{s.user?.fullName || s.user?.username}</td>
                        <td>{s.planType?.replace('_', ' ')}</td>
                        <td><span className={`incident-badge ${getStatusBadge(s.status)}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All incidents */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Incidents</h3>
          <span className="incident-badge badge-pending">{incidents.length} Total</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Type</th><th>Location</th><th>Reporter</th><th>Status</th><th>Reported</th></tr></thead>
              <tbody>
                {incidents.slice(0, 10).map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.type?.replace('_', ' ')}</td>
                    <td>{inc.location || 'Unknown'}</td>
                    <td>{inc.reporter?.fullName || inc.reporter?.username}</td>
                    <td><span className={`incident-badge ${getStatusBadge(inc.status)}`}>{inc.status}</span></td>
                    <td>{new Date(inc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
