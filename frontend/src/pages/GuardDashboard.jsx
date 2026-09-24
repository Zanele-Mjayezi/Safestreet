import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { incidentAPI, emergencyAPI, patrolAPI } from '../api/client'
import useCountUp from '../hooks/useCountUp'
import {
  Shield, AlertTriangle, Siren, MapPin, Clock, CheckCircle,
  AlertOctagon, Play, Square, Radio, Navigation
} from 'lucide-react'

function StatCard({ icon, iconClass, value, label, delay }) {
  const count = useCountUp(value || 0)
  return (
    <div className="stat-card animate-fade-in" style={{ animationDelay: delay }}>
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-value">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function GuardDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [myPatrol, setMyPatrol] = useState(null)
  const [activePatrols, setActivePatrols] = useState([])
  const [incidents, setIncidents] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [patrolArea, setPatrolArea] = useState('')

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [patrolsRes, incidentsRes, emergenciesRes] = await Promise.all([
        patrolAPI.getActive(),
        incidentAPI.getActive(),
        emergencyAPI.getActive(),
      ])
      setActivePatrols(patrolsRes.data)
      setIncidents(incidentsRes.data)
      setEmergencies(emergenciesRes.data)
      const mine = patrolsRes.data.find(p => p.guard?.username === user?.username)
      setMyPatrol(mine || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startPatrol = async () => {
    setBusy(true)
    try {
      await patrolAPI.start({ latitude: -34.04, longitude: 18.675, patrolArea: patrolArea || 'Khayelitsha' })
      await loadData()
    } catch (err) {
      alert('Failed to start patrol.')
    } finally {
      setBusy(false)
    }
  }

  const endPatrol = async () => {
    if (!myPatrol) return
    if (!window.confirm('End your current patrol?')) return
    setBusy(true)
    try {
      await patrolAPI.end(myPatrol.id)
      await loadData()
    } catch (err) {
      alert('Failed to end patrol.')
    } finally {
      setBusy(false)
    }
  }

  const resolveIncident = async (id) => {
    setBusy(true)
    try {
      await incidentAPI.resolve(id)
      await loadData()
    } catch (err) {
      alert('Failed to resolve incident.')
    } finally {
      setBusy(false)
    }
  }

  const resolveEmergency = async (id) => {
    setBusy(true)
    try {
      await emergencyAPI.resolve(id)
      await loadData()
    } catch (err) {
      alert('Failed to resolve emergency.')
    } finally {
      setBusy(false)
    }
  }

  const getBadgeClass = (type) => {
    const map = {
      THEFT: 'badge-theft', VANDALISM: 'badge-vandalism', SUSPICIOUS_PERSON: 'badge-suspicious',
      TRAFFIC_INCIDENT: 'badge-traffic', SAFETY_HAZARD: 'badge-hazard', DISTURBANCE: 'badge-disturbance',
    }
    return map[type] || 'badge-other'
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
          <h1>Guard Dashboard</h1>
          <p>Welcome back, {user?.fullName || user?.username}. Here's what needs a response right now.</p>
        </div>
        <span className="role-tag" style={{ marginLeft: 'auto' }}>Guard</span>
      </div>

      {/* Patrol control */}
      <div className="card" style={{ marginBottom: 24, borderLeft: myPatrol ? '3px solid var(--signal)' : '3px solid var(--text-muted)' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={`stat-icon ${myPatrol ? 'primary' : 'accent'}`} style={{ marginBottom: 0 }}>
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {myPatrol ? 'You are on active patrol' : 'You are off duty'}
                {myPatrol && <span className="pulse-dot" />}
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                {myPatrol ? `Patrolling: ${myPatrol.patrolArea || 'Khayelitsha'} · since ${new Date(myPatrol.startTime).toLocaleTimeString()}` : 'Start a patrol to appear on the live map and receive area alerts.'}
              </div>
            </div>
          </div>
          {myPatrol ? (
            <button className="btn btn-danger" onClick={endPatrol} disabled={busy}>
              <Square size={16} /> End Patrol
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                placeholder="Patrol area (e.g. Site C)"
                value={patrolArea}
                onChange={(e) => setPatrolArea(e.target.value)}
                style={{ width: 200 }}
              />
              <button className="btn btn-primary" onClick={startPatrol} disabled={busy}>
                <Play size={16} /> Start Patrol
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={<Siren size={22} />} iconClass="danger" value={emergencies.length} label="Active Emergencies" delay="0.05s" />
        <StatCard icon={<AlertTriangle size={22} />} iconClass="accent" value={incidents.length} label="Active Incidents" delay="0.1s" />
        <StatCard icon={<Shield size={22} />} iconClass="primary" value={activePatrols.length} label="Guards On Duty" delay="0.15s" />
      </div>

      {/* Emergencies — highest priority */}
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
                  <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: 'var(--alert-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--alert-dark)' }}>
                    <AlertOctagon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Emergency alert from {em.user?.fullName || em.user?.username}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {em.location || 'Unknown location'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {new Date(em.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => resolveEmergency(em.id)} disabled={busy}>
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active incidents */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={20} style={{ color: 'var(--accent)' }} /> Active Incidents
          </h3>
          <span className="incident-badge badge-pending">{incidents.length} Open</span>
        </div>
        <div className="card-body">
          {incidents.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} />
              <h3>Nothing needs a response</h3>
              <p>All clear across your patrol area.</p>
            </div>
          ) : (
            <div className="incident-list">
              {incidents.map((inc) => (
                <div key={inc.id} className="incident-item">
                  <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
                    <AlertOctagon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className={`incident-badge ${getBadgeClass(inc.type)}`}>{inc.type.replace('_', ' ')}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4 }}>{inc.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {inc.location || 'Unknown location'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {new Date(inc.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => resolveIncident(inc.id)} disabled={busy}>
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
