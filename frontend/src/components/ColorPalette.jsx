import React from 'react'

export const paletteColors = [
  { name: 'Ink', var: '--ink', hex: '#16233A', role: 'Headers, nav, primary text — authority & trust' },
  { name: 'Signal', var: '--signal', hex: '#1F6F64', role: 'Primary actions, active status, brand' },
  { name: 'Signal Dark', var: '--signal-dark', hex: '#15514A', role: 'Hover states, emphasis text on signal' },
  { name: 'Amber', var: '--amber', hex: '#B8720E', role: 'Warnings, pending states, secondary accent' },
  { name: 'Alert', var: '--alert', hex: '#B3261E', role: 'Emergencies & danger only — used sparingly' },
  { name: 'Paper', var: '--paper', hex: '#F4F5F1', role: 'Page background — warm neutral, not stark white' },
]

export const paletteNeutrals = [
  { name: 'Text', var: '--text', hex: '#16233A' },
  { name: 'Text Secondary', var: '--text-secondary', hex: '#5B6B7A' },
  { name: 'Text Muted', var: '--text-muted', hex: '#93A0AC' },
  { name: 'Border', var: '--border', hex: '#DDE1D9' },
  { name: 'Surface', var: '--surface', hex: '#FFFFFF' },
]

export default function ColorPalette({ showNeutrals = true, showRole = true }) {
  return (
    <>
      <div className="swatch-grid">
        {paletteColors.map(c => (
          <div className="swatch" key={c.var}>
            <div className="swatch-color" style={{ background: `var(${c.var})` }} />
            <div className="swatch-info">
              <div className="swatch-name">{c.name}</div>
              <div className="swatch-hex">{c.hex}</div>
              {showRole && <div className="swatch-role">{c.role}</div>}
            </div>
          </div>
        ))}
      </div>

      {showNeutrals && (
        <>
          <div className="swatch-divider" />
          <div className="swatch-grid">
            {paletteNeutrals.map(c => (
              <div className="swatch" key={c.var}>
                <div className="swatch-color" style={{ background: `var(${c.var})`, border: '1px solid var(--border)' }} />
                <div className="swatch-info">
                  <div className="swatch-name">{c.name}</div>
                  <div className="swatch-hex">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}