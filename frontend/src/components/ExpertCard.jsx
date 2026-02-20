import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
    Technology: { bg: 'rgba(108,99,255,0.15)', color: '#8b85ff' },
    Business: { bg: 'rgba(67,233,123,0.12)', color: '#43e97b' },
    Design: { bg: 'rgba(255,101,184,0.12)', color: '#ff65b8' },
    Marketing: { bg: 'rgba(255,165,2,0.12)', color: '#ffa502' },
    Finance: { bg: 'rgba(30,144,255,0.15)', color: '#1e90ff' },
    Health: { bg: 'rgba(255,71,87,0.12)', color: '#ff6584' },
    Education: { bg: 'rgba(255,214,0,0.12)', color: '#ffd600' },
    Legal: { bg: 'rgba(0,206,201,0.12)', color: '#00cec9' },
}

function StarRating({ rating }) {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[...Array(5)].map((_, i) => (
                <span key={i} style={{
                    fontSize: 13,
                    color: i < full ? '#ffd700' : (i === full && half ? '#ffd700' : '#3a3c60'),
                    opacity: i === full && half ? 0.6 : 1,
                }}>★</span>
            ))}
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffd700', marginLeft: 4 }}>{rating.toFixed(1)}</span>
        </div>
    )
}

export default function ExpertCard({ expert }) {
    const cat = CATEGORY_COLORS[expert.category] || { bg: 'rgba(108,99,255,0.15)', color: '#8b85ff' }
    const initials = expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)

    return (
        <div className="card card-glow fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 800, color: 'white',
                    flexShrink: 0, boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
                }}>
                    {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {expert.name}
                    </h3>
                    <span style={{
                        display: 'inline-block', padding: '2px 10px',
                        borderRadius: 100, fontSize: 11, fontWeight: 700,
                        background: cat.bg, color: cat.color,
                        letterSpacing: '0.04em',
                    }}>{expert.category}</span>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <StarRating rating={expert.rating} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                    <span>🏆</span>
                    <span>{expert.experience} yrs exp</span>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#43e97b' }}>
                    ₹{expert.hourlyRate?.toLocaleString()}/hr
                </div>
            </div>

            {/* Bio excerpt */}
            <p style={{
                fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{expert.bio}</p>

            {/* CTA */}
            <Link to={`/experts/${expert._id}`} style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary btn-full">
                    View Profile & Book →
                </button>
            </Link>
        </div>
    )
}
