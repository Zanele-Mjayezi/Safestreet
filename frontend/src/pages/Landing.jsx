import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Siren, AlertTriangle, MapPin, Users, Radio,
  Heart, Target, Eye, ArrowRight, CheckCircle
} from 'lucide-react'
import { publicAPI } from '../api/client'
import ColorPalette from '../components/ColorPalette'


function useCountUp(target, duration = 1200, start) {
  const [value, setValue] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (!start || target == null) return
    const startTime = performance.now()
    const from = 0

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration, start])

  return value
}

function StatCounter({ value, label, started }) {
  const count = useCountUp(value, 1400, started)
  return (
    <div className="landing-stat">
      <div className="landing-stat-value">{count}</div>
      <div className="landing-stat-label">{label}</div>
    </div>
  )
}

export default function Landing() {
  const [stats, setStats] = useState(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    publicAPI.getStats().then(res => setStats(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="nav-brand">
            <div className="nav-brand-icon"><Shield size={20} /></div>
            <span className="nav-brand-text">Safe<span>Street</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: '#aeb9c4', borderColor: 'rgba(255,255,255,0.2)' }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-blob" style={{ width: 260, height: 260, top: -60, left: '8%', background: 'var(--signal)' }} />
        <div className="landing-blob" style={{ width: 220, height: 220, bottom: -40, right: '10%', background: 'var(--violet)', animationDelay: '2s' }} />
        <div className="landing-blob" style={{ width: 160, height: 160, top: '30%', right: '20%', background: 'var(--sky)', animationDelay: '4s' }} />
        <div className="landing-hero-inner">
          <span className="role-tag" style={{ marginBottom: 20 }}>Khayelitsha · Community Safety Network</span>
          <h1 className="landing-hero-title">
            Built by Khayelitsha,<br />for Khayelitsha.
          </h1>
          <p className="landing-hero-sub">
            SafeStreet connects residents, neighbourhood patrol guards, and local coordinators
            on one live network — so a report, a patrol, or a call for help moves through the
            community as fast as the community already moves for each other.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Join SafeStreet <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="landing-stats" ref={statsRef}>
        <div className="landing-section-inner">
          <StatCounter value={stats?.totalIncidents ?? 0} label="Incidents Logged" started={statsVisible} />
          <StatCounter value={stats?.activeIncidents ?? 0} label="Active Right Now" started={statsVisible} />
          <StatCounter value={stats?.activePatrols ?? 0} label="Patrols On Duty" started={statsVisible} />
        </div>
      </section>

      {/* Who we're protecting */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-eyebrow">Who we're protecting</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 10 }}>
            Real people. Real reasons.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 32, maxWidth: 640 }}>
            Every feature we build starts with someone specific in mind — the neighbours SafeStreet exists to look out for.
          </p>

          <div className="persona-grid">
            <div className="persona-card">
              <div className="persona-portrait" aria-label="Elderly resident illustration">👵</div>
              <h3 className="persona-name">Thandeka, 68</h3>
              <div className="persona-role">Retired Resident</div>
              <p className="persona-quote">
                "I walk to the spaza shop most mornings. I just want someone to know if something's wrong."
              </p>
              <p className="persona-body">
                Big, simple buttons and a one-tap emergency alert — built so help is never more than a
                press away, even for someone who isn't glued to a smartphone.
              </p>
            </div>

            <div className="persona-card">
              <div className="persona-portrait" aria-label="School-going child illustration">🧒</div>
              <h3 className="persona-name">Liyema, 11</h3>
              <div className="persona-role">On Her Way to School</div>
              <p className="persona-quote">
                "Mama likes to know I got there safe."
              </p>
              <p className="persona-body">
                Parents and guardians use the live patrol map to check safer routes and times —
                and can report anything unusual along the way, for every child walking those streets.
              </p>
            </div>

            <div className="persona-card">
             <div className="persona-portrait" aria-label="Working mother illustration">👩</div>
              <h3 className="persona-name">Nomsa, 34</h3>
              <div className="persona-role">Working Mother</div>
              <p className="persona-quote">
                "Between the taxi rank and my front door is the part of the day I worry about most."
              </p>
              <p className="persona-body">
                One tap sends an emergency alert straight to nearby on-duty guards — so the walk
                home after a night shift doesn't have to be a walk alone.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-eyebrow">Why we exist</div>
          <div className="grid-2" style={{ gap: 20 }}>
            <div className="card">
              <div className="card-body">
                <div className="stat-icon primary" style={{ marginBottom: 16 }}><Target size={20} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 10 }}>Our Mission</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Give every resident of Khayelitsha a direct line to help — instant incident
                  reporting, live patrol visibility, and a one-tap emergency alert — built around
                  a neighbourhood watch culture that already looks out for its own.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="stat-icon accent" style={{ marginBottom: 16 }}><Eye size={20} /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 10 }}>Our Vision</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  A Khayelitsha where safety isn't something you wait for — it's something
                  the whole street shares in real time, coordinated between residents, guards,
                  and community leaders on one shared map.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Khayelitsha */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-eyebrow">What drives us</div>
          <div style={{ maxWidth: 760 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 16 }}>
              A team from here, building for here.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 14 }}>
              Khayelitsha is one of Cape Town's largest and fastest-growing communities — and one
              with a long, real tradition of neighbourhood watch groups, street committees, and
              patrol volunteers who show up for each other every single day. What's often missing
              isn't the will to keep each other safe — it's the tools to coordinate it quickly.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              SafeStreet started as a student-built project with one goal: put that existing
              spirit of community patrol into everyone's pocket, so a report from a resident,
              a guard's live location, and an emergency alert all move through the same
              network instead of getting stuck in separate WhatsApp groups and word of mouth.
            </p>
          </div>

          <div className="landing-value-grid">
            <div className="landing-value">
              <Heart size={20} />
              <div>
                <strong>Community-first</strong>
                <p>Built around neighbourhood watch culture, not against it.</p>
              </div>
            </div>
            <div className="landing-value">
              <Radio size={20} />
              <div>
                <strong>Real-time by design</strong>
                <p>Reports, patrols, and alerts sync live across every role.</p>
              </div>
            </div>
            <div className="landing-value">
              <Users size={20} />
              <div>
                <strong>Everyone has a role</strong>
                <p>Residents, guards, and coordinators each get the view they need.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-eyebrow">How it works</div>
          <div className="grid-3" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-body">
                <AlertTriangle size={22} style={{ color: 'var(--signal-dark)', marginBottom: 12 }} />
                <h4 style={{ marginBottom: 6, fontSize: '1rem' }}>Report</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Log an incident in seconds — type, location, and description reach guards instantly.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <MapPin size={22} style={{ color: 'var(--signal-dark)', marginBottom: 12 }} />
                <h4 style={{ marginBottom: 6, fontSize: '1rem' }}>Track</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  See active patrols and incidents live on the map, wherever you are.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <Siren size={22} style={{ color: 'var(--alert)', marginBottom: 12 }} />
                <h4 style={{ marginBottom: 6, fontSize: '1rem' }}>Respond</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  One tap sends an emergency alert straight to nearby guards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design system showcase */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-eyebrow">Designed with intent</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 10 }}>
            Our palette
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24, maxWidth: 640 }}>
            A civic-dispatch identity: navy for authority, one signal color for action, amber
            for caution, and red reserved only for genuine emergencies.
          </p>
          <div className="card">
            <div className="card-body">
              <ColorPalette showNeutrals={false} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-blob" style={{ width: 200, height: 200, top: -50, left: '20%', background: 'var(--signal)' }} />
        <div className="landing-blob" style={{ width: 180, height: 180, bottom: -60, right: '15%', background: 'var(--amber)', animationDelay: '3s' }} />
        <div className="landing-section-inner" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: 12 }}>
            Ready to join the network?
          </h2>
          <p style={{ color: '#aeb9c4', marginBottom: 24 }}>
            Free to sign up. Report your first incident in under a minute.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Your Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-section-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aeb9c4', fontSize: '0.85rem' }}>
            <Shield size={16} /> SafeStreet Khayelitsha — built by the community, for the community.
          </div>
        </div>
      </footer>
    </div>
  )
}
