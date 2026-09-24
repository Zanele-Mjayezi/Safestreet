import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { patrolAPI, incidentAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { MapPin, Navigation, Users, Shield } from 'lucide-react'
import L from 'leaflet'

const guardIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background: #1f6f64; width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(22,35,58,0.35);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const incidentIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background: #b3261e; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(22,35,58,0.35);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

export default function PatrolMap() {
  const { user, isGuard, isAdmin } = useAuth()
  const [patrols, setPatrols] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [patrolsRes, incidentsRes] = await Promise.all([
        patrolAPI.getActive(),
        incidentAPI.getActive()
      ])
      setPatrols(patrolsRes.data)
      setIncidents(incidentsRes.data.filter(i => i.latitude && i.longitude))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
      <div className="page-header">
        <h1>Patrol Map</h1>
        <p>Live tracking of security patrols and active incidents in Khayelitsha.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon primary"><Shield size={22} /></div>
          <div className="stat-value">{patrols.length}</div>
          <div className="stat-label">Active Patrols</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><Navigation size={22} /></div>
          <div className="stat-value">{incidents.length}</div>
          <div className="stat-label">Mapped Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><Users size={22} /></div>
          <div className="stat-value">{(isGuard() || isAdmin()) ? 'On Duty' : 'Protected'}</div>
          <div className="stat-label">Your Status</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="map-container">
            <MapContainer
              center={[-34.04, 18.675]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {patrols.map(patrol => (
                <Marker
                  key={patrol.id}
                  position={[patrol.currentLat || -34.04, patrol.currentLng || 18.675]}
                  icon={guardIcon}
                >
                  <Popup>
                    <div style={{ padding: 4 }}>
                      <strong>{patrol.guard?.fullName || 'Guard'}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: '#5b6b7a' }}>
                        Area: {patrol.patrolArea || 'Unknown'}<br />
                        Status: {patrol.status}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {incidents.map(inc => (
                <Marker
                  key={`inc-${inc.id}`}
                  position={[inc.latitude, inc.longitude]}
                  icon={incidentIcon}
                >
                  <Popup>
                    <div style={{ padding: 4 }}>
                      <strong>{inc.type.replace('_', ' ')}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: '#5b6b7a' }}>
                        {inc.description?.substring(0, 100)}...<br />
                        {inc.location}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Circle center={[-34.04, 18.675]} radius={2000} pathOptions={{ color: '#1f6f64', fillColor: '#1f6f64', fillOpacity: 0.05 }} />
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Patrols</h3>
          </div>
          <div className="card-body">
            {patrols.length === 0 ? (
              <div className="empty-state">
                <Shield size={48} />
                <p>No active patrols at the moment.</p>
              </div>
            ) : (
              <div className="incident-list">
                {patrols.map(p => (
                  <div key={p.id} className="incident-item">
                    <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{p.guard?.fullName || 'Guard'}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {p.patrolArea} • {p.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Incidents on Map</h3>
          </div>
          <div className="card-body">
            {incidents.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} />
                <p>No geolocated incidents.</p>
              </div>
            ) : (
              <div className="incident-list">
                {incidents.map(inc => (
                  <div key={inc.id} className="incident-item">
                    <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{inc.type.replace('_', ' ')}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {inc.location}
                      </p>
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
