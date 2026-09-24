import React, { useState, useEffect } from 'react'
import { incidentAPI } from '../api/client'
import { AlertTriangle, MapPin, Send, CheckCircle, FileText } from 'lucide-react'

export default function IncidentReport() {
  const [form, setForm] = useState({
    type: 'THEFT',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
  })
  const [myIncidents, setMyIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadMyIncidents()
  }, [])

  const loadMyIncidents = async () => {
    try {
      const res = await incidentAPI.getMy()
      setMyIncidents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    try {
      await incidentAPI.report({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      })
      setSuccess(true)
      setForm({ type: 'THEFT', description: '', location: '', latitude: '', longitude: '' })
      loadMyIncidents()
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      alert('Failed to report incident.')
    } finally {
      setLoading(false)
    }
  }

  const incidentTypes = [
    { value: 'THEFT', label: 'Theft', icon: '🏃' },
    { value: 'VANDALISM', label: 'Vandalism', icon: '🔨' },
    { value: 'SUSPICIOUS_PERSON', label: 'Suspicious Person', icon: '🕵️' },
    { value: 'TRAFFIC_INCIDENT', label: 'Traffic Incident', icon: '🚗' },
    { value: 'SAFETY_HAZARD', label: 'Safety Hazard', icon: '⚠️' },
    { value: 'DISTURBANCE', label: 'Disturbance', icon: '🔊' },
    { value: 'OTHER', label: 'Other', icon: '📝' },
  ]

  const getBadgeClass = (type) => {
    const map = {
      THEFT: 'badge-theft', VANDALISM: 'badge-vandalism',
      SUSPICIOUS_PERSON: 'badge-suspicious', TRAFFIC_INCIDENT: 'badge-traffic',
      SAFETY_HAZARD: 'badge-hazard', DISTURBANCE: 'badge-disturbance',
    }
    return map[type] || 'badge-other'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Report an Incident</h1>
        <p>Help keep Khayelitsha safe by reporting incidents in real-time.</p>
      </div>

      <div className="grid-2">
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} style={{ color: 'var(--accent)' }} />
              New Report
            </h3>
          </div>
          <div className="card-body">
            {success && (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={18} />
                Incident reported successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Incident Type</label>
                <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                  {incidentTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description" className="form-textarea"
                  placeholder="Describe what happened, when, and any suspect details..."
                  value={form.description} onChange={handleChange} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
                  <input
                    type="text" name="location" className="form-input" style={{ paddingLeft: 44 }}
                    placeholder="e.g., Site C Taxi Rank, Block 45"
                    value={form.location} onChange={handleChange} required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Latitude (optional)</label>
                  <input type="number" step="any" name="latitude" className="form-input"
                    placeholder="-34.0423" value={form.latitude} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude (optional)</label>
                  <input type="number" step="any" name="longitude" className="form-input"
                    placeholder="18.6765" value={form.longitude} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                <Send size={18} />
                {loading ? 'Reporting...' : 'Report Incident'}
              </button>
            </form>
          </div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
              My Reports
            </h3>
          </div>
          <div className="card-body">
            {myIncidents.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <p>No incidents reported yet.</p>
              </div>
            ) : (
              <div className="incident-list">
                {myIncidents.map(inc => (
                  <div key={inc.id} className="incident-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`incident-badge ${getBadgeClass(inc.type)}`}>
                          {inc.type.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(inc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: 2 }}>{inc.description}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inc.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
