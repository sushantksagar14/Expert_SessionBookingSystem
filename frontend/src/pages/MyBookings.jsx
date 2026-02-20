import { useState } from 'react'
import API from '../api/axios'
import useSocket from '../hooks/useSocket'

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#ffa502', bg: 'rgba(255,165,2,0.15)', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: '#2ed573', bg: 'rgba(46,213,115,0.15)', icon: '✅' },
    completed: { label: 'Completed', color: '#1e90ff', bg: 'rgba(30,144,255,0.15)', icon: '🎓' },
}

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 100,
            fontSize: 12, fontWeight: 700,
            background: cfg.bg, color: cfg.color,
        }}>
            {cfg.icon} {cfg.label}
        </span>
    )
}

function formatDisplayDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

export default function MyBookings() {
    const [email, setEmail] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)
    const [emailError, setEmailError] = useState('')

    const fetchBookings = async () => {
        const trimmed = emailInput.trim()
        if (!trimmed) { setEmailError('Please enter your email address'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setEmailError('Enter a valid email address'); return }
        setEmailError('')
        setEmail(trimmed)
        setLoading(true)
        setError('')
        try {
            const res = await API.get('/bookings', { params: { email: trimmed } })
            setBookings(res.data.data)
            setSearched(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Real-time status updates
    useSocket('bookingStatusUpdated', ({ bookingId, status }) => {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b))
    })

    const grouped = bookings.reduce((acc, b) => {
        const key = b.status
        if (!acc[key]) acc[key] = []
        acc[key].push(b)
        return acc
    }, {})

    return (
        <div className="page">
            <div className="section-header">
                <h1>My Bookings</h1>
                <p>Enter your email to view all your session bookings</p>
            </div>

            {/* Email search */}
            <div className="card" style={{ maxWidth: 560, marginBottom: 40 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔍 Find Your Bookings</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <input
                            id="booking-email"
                            className={`form-input ${emailError ? 'error' : ''}`}
                            type="email"
                            placeholder="Enter your email address"
                            value={emailInput}
                            onChange={(e) => { setEmailInput(e.target.value); setEmailError('') }}
                            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
                        />
                        {emailError && <span className="form-error">{emailError}</span>}
                    </div>
                    <button
                        id="search-bookings-btn"
                        className="btn btn-primary"
                        onClick={fetchBookings}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Search'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="error-state">
                    <div className="icon">😕</div>
                    <h3>Error Loading Bookings</h3>
                    <p>{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="loading-center">
                    <div className="spinner" />
                    <span>Fetching your bookings...</span>
                </div>
            )}

            {/* No Bookings */}
            {!loading && searched && bookings.length === 0 && !error && (
                <div className="empty-state">
                    <div className="icon">📋</div>
                    <h3>No Bookings Found</h3>
                    <p>No bookings found for <strong>{email}</strong>. Book a session with an expert to get started!</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Browse Experts</a>
                </div>
            )}

            {/* Bookings List */}
            {!loading && bookings.length > 0 && (
                <>
                    {/* Summary */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <div key={key} style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 12,
                                padding: '16px 24px',
                                display: 'flex', alignItems: 'center', gap: 12,
                            }}>
                                <span style={{ fontSize: 24 }}>{cfg.icon}</span>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: cfg.color }}>
                                        {grouped[key]?.length || 0}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{cfg.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bookings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {bookings.map(booking => (
                            <div key={booking._id} className="booking-item">
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                                            Session with {booking.expertName}
                                        </h3>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px 24px' }}>
                                        <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                                            <span>📅</span>
                                            <span>{formatDisplayDate(booking.date)}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                                            <span>🕐</span>
                                            <span>{booking.timeSlot}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                                            <span>👤</span>
                                            <span>{booking.userName}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                                            <span>📧</span>
                                            <span>{booking.email}</span>
                                        </div>
                                        {booking.notes && (
                                            <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)', fontSize: 13, gridColumn: '1/-1' }}>
                                                <span>📝</span>
                                                <span style={{ fontStyle: 'italic' }}>{booking.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                                    {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p style={{ marginTop: 32, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
                        Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''} for {email} · Status updates in real-time
                    </p>
                </>
            )}
        </div>
    )
}
