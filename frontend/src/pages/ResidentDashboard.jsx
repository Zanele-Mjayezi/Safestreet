import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { publicAPI, emergencyAPI, incidentAPI } from '../api/client'
import useCountUp from '../hooks/useCountUp'
import {
  Shield, AlertTriangle, Users, MapPin, Activity, Clock,
  AlertOctagon, CheckCircle, TrendingUp, Siren
} from 'lucide-react'

function StatCard({ icon, iconClass, value, label, delay, isText }) {
  const count = useCountUp(isText ? 0 : (value || 0))
  return (
    <div className="stat-card animate-fade-in" style={{ animationDelay: delay }}>
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-value">{isText ? (value || 'None') : count}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function ResidentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [emergencyTriggered, setEmergencyTriggered] = useState(false)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        publicAPI.getStats(),
        incidentAPI.getActive()
      ])
      setStats(statsRes.data)
      setIncidents(incidentsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmergency = async () => {
    if (!window.confirm('Are you sure you want to trigger an EMERGENCY ALERT? This will notify all nearby guards and community members.')) return
    try {
      setEmergencyTriggered(true)
      await emergencyAPI.trigger({
        latitude: -34.04,
        longitude: 18.675,
        location: 'Current Location'
      })
      alert('Emergency alert sent! Guards have been notified.')
    } catch (err) {
      alert('Failed to send emergency alert.')
    } finally {
      setEmergencyTriggered(false)
    }
  }

  const getBadgeClass = (type) => {
    const map = {
      THEFT: 'badge-theft',
      VANDALISM: 'badge-vandalism',
      SUSPICIOUS_PERSON: 'badge-suspicious',
      TRAFFIC_INCIDENT: 'badge-traffic',
      SAFETY_HAZARD: 'badge-hazard',
      DISTURBANCE: 'badge-disturbance',
    }
    return map[type] || 'badge-other'
  }

  const getStatusBadge = (status) => {
    const map = {
      ACTIVE: 'badge-active',
      PENDING: 'badge-pending',
      RESOLVED: 'badge-resolved',
    }
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
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.fullName || user?.username}. Here's what's happening in Khayelitsha.</p>
        </div>
        <span className="role-tag" style={{ marginLeft: 'auto' }}>Resident</span>
      </div>

      {/* Emergency Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <button
          className="emergency-btn"
          onClick={handleEmergency}
          disabled={emergencyTriggered}
        >
          <Siren size={48} />
          <span>{emergencyTriggered ? 'Sending...' : 'EMERGENCY'}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.9 }}>Tap to Alert Guards</span>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={<Shield size={22} />} iconClass="primary" value={stats?.totalIncidents} label="Total Incidents Reported" delay="0.05s" />
        <StatCard icon={<AlertTriangle size={22} />} iconClass="danger" value={stats?.activeIncidents} label="Active Incidents" delay="0.1s" />
        <StatCard icon={<Users size={22} />} iconClass="accent" value={stats?.activePatrols} label="Active Patrols" delay="0.15s" />
        <StatCard icon={<TrendingUp size={22} />} iconClass="success" value={user?.subscriptionPlan?.replace('_', ' ')} isText label="Your Plan" delay="0.2s" />
      </div>

      {/* Active Incidents */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} style={{ color: 'var(--accent)' }} />
            Active Incidents
          </h3>
          <span className="badge-active incident-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="pulse-dot" /> {incidents.length} Active
          </span>
        </div>
        <div className="card-body">
          {incidents.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} />
              <h3>No Active Incidents</h3>
              <p>The community is safe right now. Great work!</p>
            </div>
          ) : (
            <div className="incident-list">
              {incidents.map((inc, i) => (
                <div key={inc.id} className="incident-item animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
                    <AlertOctagon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className={`incident-badge ${getBadgeClass(inc.type)}`}>
                        {inc.type.replace('_', ' ')}
                      </span>
                      <span className={`incident-badge ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4 }}>{inc.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {inc.location || 'Unknown location'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {new Date(inc.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
