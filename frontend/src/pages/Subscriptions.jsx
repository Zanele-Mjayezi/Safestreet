import React, { useEffect, useState } from 'react'
import { subscriptionAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Shield, Zap, Crown, Check, Clock, AlertCircle } from 'lucide-react'

export default function Subscriptions() {
  const { user } = useAuth()
  const [mySubs, setMySubs] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const res = await subscriptionAPI.getMy()
      setMySubs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubscribe = async (planType) => {
    setLoading(true)
    setMessage('')
    try {
      await subscriptionAPI.create({
        planType,
        paymentMethod: 'VISA ****1234'
      })
      setMessage('Subscription activated successfully!')
      loadSubscriptions()
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to activate subscription.')
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Standard Protection',
      plan: 'STANDARD_PROTECTION',
      price: 14.99,
      icon: Shield,
      color: 'var(--primary)',
      features: ['Core Security Alerts', '24/7 Patrol Updates', 'Basic Incident Reporting', 'Community WhatsApp Group'],
      popular: false
    },
    {
      name: 'Advanced Guard',
      plan: 'ADVANCED_GUARD',
      price: 29.99,
      icon: Zap,
      color: 'var(--accent)',
      features: ['Emergency Alarm Button', 'Priority Incident Reporting', 'Live Patrol Tracking', 'Guard Direct Contact', 'Load Shedding Alerts'],
      popular: true
    },
    {
      name: 'Premium Shield',
      plan: 'PREMIUM_SHIELD',
      price: 49.99,
      icon: Crown,
      color: 'var(--ink)',
      features: ['Full Patrol Coverage', 'Priority Response (< 5 min)', 'Family Protection Plan', 'Business Security', 'Dedicated Guard Assignment'],
      popular: false
    }
  ]

  const currentPlan = user?.subscriptionPlan

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Subscription Plans</h1>
        <p>Choose the protection level that fits your family or business.</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
            <CreditCard size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Current Plan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {currentPlan ? currentPlan.replace('_', ' ') : 'No active subscription'}
              {user?.subscriptionActive && <span className="badge-active" style={{ marginLeft: 10 }}>Active</span>}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              R{mySubs[0]?.amount || '0.00'}
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/month</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <Clock size={12} /> Next payment: {mySubs[0]?.endDate ? new Date(mySubs[0].endDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan === plan.plan
          const PlanIcon = plan.icon
          return (
            <div
              key={plan.plan}
              className={`plan-card animate-fade-in ${plan.popular ? 'popular' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && <div className="plan-badge">Most Popular</div>}
              {isCurrent && <div className="plan-badge" style={{ background: 'var(--success)', left: 'auto', right: 20, transform: 'none', borderRadius: 12 }}>Active</div>}

              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${plan.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: plan.color }}>
                <PlanIcon size={28} />
              </div>

              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                R{plan.price}<span>/month</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>

              <button
                className={`btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}`}
                style={{ width: '100%' }}
                onClick={() => !isCurrent && handleSubscribe(plan.plan)}
                disabled={loading || isCurrent}
              >
                {isCurrent ? (
                  <><Check size={18} /> Current Plan</>
                ) : loading ? (
                  'Processing...'
                ) : (
                  'Activate Plan'
                )}
              </button>
            </div>
          )
        })}
      </div>

      {mySubs.length > 0 && (
        <div className="card" style={{ marginTop: 28 }}>
          <div className="card-header">
            <h3 className="card-title">Payment History</h3>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubs.map(sub => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 600 }}>{sub.planType.replace('_', ' ')}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>R{sub.amount}</td>
                      <td>
                        <span className={`badge-${sub.status.toLowerCase()}`} style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                          {sub.status}
                        </span>
                      </td>
                      <td>{sub.paymentMethod}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
