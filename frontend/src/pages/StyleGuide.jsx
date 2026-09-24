import React from 'react'
import { Shield, AlertTriangle, Siren, MapPin, Clock, CheckCircle } from 'lucide-react'
import ColorPalette from '../components/ColorPalette'

export default function StyleGuide() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Design System</h1>
        <p>The visual language behind SafeStreet — a civic-dispatch identity built for clarity under pressure.</p>
      </div>

      {/* Concept note */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body">
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 760 }}>
            SafeStreet's job is turning scattered street-level signals — incidents, patrols, emergencies —
            into fast, coordinated action. The identity is grounded in dispatch and civic-signage systems
            rather than generic software: a navy-and-paper palette for authority and calm, monospaced tags
            for every status label (like a dispatch log), and a physical "pull station" emergency button
            instead of a decorative gradient blob.
          </p>
        </div>
      </div>

      {/* Color palette */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <h3 className="card-title">Color Palette</h3>
          <span className="role-tag">6 core colors</span>
        </div>
        <div className="card-body">
          <ColorPalette />
        </div>
      </div>

      {/* Typography */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <h3 className="card-title">Typography</h3>
          <span className="role-tag">3 typefaces</span>
        </div>
        <div className="card-body">
          <div className="type-specimen">
            <div className="type-specimen-label">Space Grotesk — Display / Headings / Numbers</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem' }}>
              Community Safety, Coordinated
            </div>
          </div>
          <div className="type-specimen">
            <div className="type-specimen-label">IBM Plex Sans — Body Text</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 640 }}>
              The quick brown fox jumps over the lazy dog. Used for paragraphs, form labels'
              content, and anything meant to be read at length.
            </div>
          </div>
          <div className="type-specimen">
            <div className="type-specimen-label">IBM Plex Mono — Status Tags, Codes, Data</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', letterSpacing: '0.03em' }}>
              [ACTIVE]  [THEFT]  INC-0042  14:32:07
            </div>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Buttons & Tags</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-accent">Accent</button>
              <button className="btn btn-danger">Danger</button>
              <button className="btn btn-ghost">Ghost</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="incident-badge badge-active">Active</span>
              <span className="incident-badge badge-pending">Pending</span>
              <span className="incident-badge badge-resolved">Resolved</span>
              <span className="incident-badge badge-theft">Theft</span>
              <span className="incident-badge badge-hazard">Hazard</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sample Ticket</h3>
          </div>
          <div className="card-body">
            <div className="incident-item">
              <div style={{ minWidth: 36, height: 36, borderRadius: 6, background: 'var(--signal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--signal-dark)' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <span className="incident-badge badge-suspicious">Suspicious Person</span>
                  <span className="incident-badge badge-active">Active</span>
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: 4 }}>Someone loitering near the corner shop.</p>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span><MapPin size={11} /> Site C</span>
                  <span><Clock size={11} /> 2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature element */}
      <div className="card" style={{ marginTop: 28 }}>
        <div className="card-header">
          <h3 className="card-title">Signature Element — Emergency Panel</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <button className="emergency-btn" disabled style={{ cursor: 'default' }}>
            <Siren size={34} />
            <span>EMERGENCY</span>
            <span>Press to Alert Guards</span>
          </button>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 420 }}>
            Modeled on a physical fire-alarm pull station rather than a soft gradient circle —
            flat alert red, an amber hazard stripe, and a mono label, so the one truly urgent
            action on the page reads as unmistakably serious.
          </p>
        </div>
      </div>
    </div>
  )
}
