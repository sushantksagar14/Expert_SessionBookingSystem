import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
    const { pathname } = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { to: '/', label: 'Find Experts' },
        { to: '/my-bookings', label: 'My Bookings' },
    ]

    return (
        <nav style={{
            background: 'rgba(13,14,26,0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(108,99,255,0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '0 24px',
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                    }}>⚡</div>
                    <span style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 800,
                        fontSize: 20,
                        background: 'linear-gradient(135deg, #f0f0ff, #8b85ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>ExpertConnect</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                color: pathname === to ? '#8b85ff' : '#8b8db8',
                                background: pathname === to ? 'rgba(108,99,255,0.12)' : 'transparent',
                                border: '1px solid',
                                borderColor: pathname === to ? 'rgba(108,99,255,0.3)' : 'transparent',
                            }}
                        >{label}</Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
