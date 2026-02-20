import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function Field({ label, id, error, children }) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={id}>{label}</label>
            {children}
            {error && <span className="form-error">{error}</span>}
        </div>
    )
}

function validate(fields) {
    const errors = {}
    if (!fields.userName.trim()) errors.userName = 'Full name is required'
    else if (fields.userName.trim().length < 2) errors.userName = 'Name must be at least 2 characters'

    if (!fields.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email'

    if (!fields.phone.trim()) errors.phone = 'Phone number is required'
    else if (!/^[0-9]{10}$/.test(fields.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit phone number'

    if (!fields.selectedSlotId) errors.slot = 'Please select a time slot'

    return errors
}

export default function Booking() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const expert = state?.expert
    const preSlot = state?.slot

    const [form, setForm] = useState({
        userName: '',
        email: '',
        phone: '',
        notes: '',
        selectedSlotId: preSlot?._id || '',
        selectedDate: preSlot?.date || '',
        selectedTime: preSlot?.time || '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)
    const [apiError, setApiError] = useState('')

    if (!expert) {
        return (
            <div className="page">
                <div className="error-state">
                    <div className="icon">🔗</div>
                    <h3>No Expert Selected</h3>
                    <p>Please go back and select an expert and time slot first.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Browse Experts</Link>
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiError('')
        const errs = validate(form)
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setLoading(true)
        try {
            const res = await API.post('/bookings', {
                expertId: expert._id,
                slotId: form.selectedSlotId,
                userName: form.userName,
                email: form.email,
                phone: form.phone,
                date: form.selectedDate,
                timeSlot: form.selectedTime,
                notes: form.notes,
            })
            setSuccess(res.data.data)
        } catch (err) {
            setApiError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="page">
                <div className="success-box">
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 24 }}>
                        Your session has been successfully booked. You'll receive a confirmation soon.
                    </p>
                    <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '20px 24px',
                        maxWidth: 420,
                        margin: '0 auto 32px',
                        textAlign: 'left',
                    }}>
                        <div className="info-grid">
                            <div className="info-row"><span className="info-key">Expert</span><span className="info-val">{success.expertName}</span></div>
                            <div className="info-row"><span className="info-key">Name</span><span className="info-val">{success.userName}</span></div>
                            <div className="info-row"><span className="info-key">Date</span><span className="info-val">{success.date}</span></div>
                            <div className="info-row"><span className="info-key">Time</span><span className="info-val">{success.timeSlot}</span></div>
                            <div className="info-row"><span className="info-key">Status</span>
                                <span className="badge badge-warning" style={{ width: 'fit-content' }}>⏳ {success.status}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
                        <Link to="/" className="btn btn-ghost">← Browse More Experts</Link>
                    </div>
                </div>
            </div>
        )
    }

    const initials = expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)

    return (
        <div className="page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                {/* Expert Summary Card */}
                <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: 'white', flexShrink: 0,
                    }}>{initials}</div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Booking Session With</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{expert.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{expert.category} Expert · ⭐ {expert.rating}</div>
                    </div>
                    {form.selectedTime && (
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Selected Slot</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-light)' }}>{form.selectedTime}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{form.selectedDate}</div>
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                <div className="card">
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Complete Your Booking</h2>

                    {apiError && (
                        <div style={{
                            background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)',
                            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
                            color: 'var(--error)', fontSize: 14, display: 'flex', gap: 8, alignItems: 'center',
                        }}>
                            ❌ {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <Field label="Full Name *" id="userName" error={errors.userName}>
                            <input
                                id="userName"
                                name="userName"
                                className={`form-input ${errors.userName ? 'error' : ''}`}
                                type="text"
                                placeholder="Enter your full name"
                                value={form.userName}
                                onChange={handleChange}
                            />
                        </Field>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Email Address *" id="email" error={errors.email}>
                                <input
                                    id="email"
                                    name="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field label="Phone Number *" id="phone" error={errors.phone}>
                                <input
                                    id="phone"
                                    name="phone"
                                    className={`form-input ${errors.phone ? 'error' : ''}`}
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                            </Field>
                        </div>

                        {/* Slot display (pre-selected from detail page) */}
                        <div style={{
                            background: form.selectedSlotId ? 'rgba(108,99,255,0.1)' : 'rgba(255,71,87,0.05)',
                            border: `1.5px solid ${form.selectedSlotId ? 'rgba(108,99,255,0.3)' : 'rgba(255,71,87,0.3)'}`,
                            borderRadius: 10, padding: '14px 16px',
                        }}>
                            {form.selectedSlotId ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 4 }}>📅 Selected Slot</div>
                                        <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{form.selectedDate} at {form.selectedTime}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/experts/${expert._id}`)}
                                        style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >Change</button>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--error)', fontSize: 14 }}>
                                    ⚠️ No slot selected.{' '}
                                    <button type="button" onClick={() => navigate(`/experts/${expert._id}`)} style={{ color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>
                                        Pick a slot
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.slot && <span className="form-error">{errors.slot}</span>}

                        <Field label="Notes / Topic (Optional)" id="notes" error={errors.notes}>
                            <textarea
                                id="notes"
                                name="notes"
                                className="form-input"
                                placeholder="What would you like to discuss? (optional)"
                                value={form.notes}
                                onChange={handleChange}
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                        </Field>

                        <button
                            type="submit"
                            id="submit-booking"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={loading}
                            style={{ marginTop: 8 }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                    Booking...
                                </span>
                            ) : '⚡ Confirm Booking'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
