import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import useSocket from '../hooks/useSocket'

function groupSlotsByDate(slots) {
    return slots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = []
        acc[slot.date].push(slot)
        return acc
    }, {})
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.round((d - today) / 86400000)
    const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : ''
    return {
        display: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        label,
    }
}

const STAR_COLORS = {
    Technology: '💻', Business: '💼', Design: '🎨',
    Marketing: '📈', Finance: '💰', Health: '🧘',
    Education: '📚', Legal: '⚖️',
}

export default function ExpertDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expert, setExpert] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeDate, setActiveDate] = useState('')
    const [toast, setToast] = useState('')

    const fetchExpert = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await API.get(`/experts/${id}`)
            setExpert(res.data.data)
            const firstDate = Object.keys(groupSlotsByDate(res.data.data.slots))[0]
            setActiveDate(firstDate || '')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => { fetchExpert() }, [fetchExpert])

    // Real-time slot update via Socket.io
    useSocket('slotBooked', ({ expertId, slotId }) => {
        if (expertId !== id) return
        setExpert(prev => {
            if (!prev) return prev
            return {
                ...prev,
                slots: prev.slots.map(s => s._id === slotId ? { ...s, isBooked: true } : s),
            }
        })
        showToast('🔴 A slot just got booked in real-time!')
    })

    const showToast = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(''), 4000)
    }

    if (loading) return (
        <div className="page">
            <div className="loading-center">
                <div className="spinner" />
                <span>Loading expert profile...</span>
            </div>
        </div>
    )
    if (error) return (
        <div className="page">
            <div className="error-state">
                <div className="icon">😕</div>
                <h3>Failed to load expert</h3>
                <p>{error}</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Experts</Link>
            </div>
        </div>
    )
    if (!expert) return null

    const grouped = groupSlotsByDate(expert.slots)
    const dates = Object.keys(grouped).sort()
    const slotsForDate = grouped[activeDate] || []
    const initials = expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    const icon = STAR_COLORS[expert.category] || '👤'

    return (
        <div className="page">
            {/* Toast */}
            {toast && (
                <div className="toast">
                    <span>{toast}</span>
                </div>
            )}

            {/* Back */}
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Back to Experts
            </button>

            {/* Expert Hero */}
            <div className="expert-hero">
                <div className="expert-avatar-lg">
                    <span style={{ fontSize: 40 }}>{icon}</span>
                </div>
                <div className="expert-hero-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{expert.name}</h1>
                        <span style={{
                            padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                            background: 'rgba(108,99,255,0.2)', color: 'var(--primary-light)',
                        }}>{expert.category}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 600 }}>
                        {expert.bio}
                    </p>
                    <div className="expert-hero-stats">
                        <div className="stat-item">
                            <span className="stat-label">Experience</span>
                            <span className="stat-value">{expert.experience} years</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Rating</span>
                            <span className="stat-value" style={{ color: '#ffd700' }}>⭐ {expert.rating.toFixed(1)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Hourly Rate</span>
                            <span className="stat-value" style={{ color: 'var(--success)' }}>₹{expert.hourlyRate?.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Slots</span>
                            <span className="stat-value">{expert.slots.filter(s => !s.isBooked).length} available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Slots Section */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Available Time Slots</h2>
                    <div className="live-indicator">
                        <div className="live-dot" />
                        <span>Live</span>
                    </div>
                </div>

                {/* Date Tabs */}
                {dates.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No slots available</p>
                ) : (
                    <>
                        <div className="tabs">
                            {dates.map(date => {
                                const { display, label } = formatDate(date)
                                const available = grouped[date].filter(s => !s.isBooked).length
                                return (
                                    <button
                                        key={date}
                                        className={`tab-btn ${activeDate === date ? 'active' : ''}`}
                                        onClick={() => setActiveDate(date)}
                                    >
                                        {label ? <strong>{label}</strong> : display}
                                        {' '}
                                        <span style={{ opacity: 0.7, fontSize: 11 }}>({available})</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Slots Grid */}
                        <div className="slot-grid">
                            {slotsForDate.map(slot => (
                                <div
                                    key={slot._id}
                                    className={`slot-pill ${slot.isBooked ? 'booked' : 'available'}`}
                                    onClick={() => {
                                        if (!slot.isBooked) {
                                            navigate(`/book/${expert._id}`, {
                                                state: { expert, slot },
                                            })
                                        }
                                    }}
                                >
                                    {slot.isBooked ? '🔒' : '🕐'} {slot.time}
                                    {slot.isBooked && <span style={{ fontSize: 10, marginLeft: 4 }}>Booked</span>}
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 16 }}>
                            🟢 Click an available slot to book. 🔴 Red slots are already taken. Slots update live.
                        </p>
                    </>
                )}
            </div>

            {/* Book CTA */}
            <div style={{ display: 'flex', gap: 12 }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                        const firstAvailable = expert.slots.find(s => !s.isBooked)
                        if (firstAvailable) navigate(`/book/${expert._id}`, { state: { expert, slot: firstAvailable } })
                    }}
                    disabled={!expert.slots.some(s => !s.isBooked)}
                >
                    ⚡ Book a Session
                </button>
                <Link to="/" className="btn btn-ghost btn-lg">← All Experts</Link>
            </div>
        </div>
    )
}
