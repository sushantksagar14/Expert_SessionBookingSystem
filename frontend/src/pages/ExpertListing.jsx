import { useState, useEffect, useCallback } from 'react'
import API from '../api/axios'
import ExpertCard from '../components/ExpertCard'

const CATEGORIES = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Health', 'Education', 'Legal']

function SkeletonCard() {
    return (
        <div className="card" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 16 }}>
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 18, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
            </div>
            <div className="skeleton" style={{ height: 14, width: '100%' }} />
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
            <div className="skeleton" style={{ height: 40, width: '100%', borderRadius: 10 }} />
        </div>
    )
}

export default function ExpertListing() {
    const [experts, setExperts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
    const [searchTerm, setSearchTerm] = useState('')

    const fetchExperts = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const params = { page, limit: 6 }
            if (searchTerm) params.search = searchTerm
            if (category !== 'All') params.category = category
            const res = await API.get('/experts', { params })
            setExperts(res.data.data)
            setPagination(res.data.pagination)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [page, searchTerm, category])

    useEffect(() => { fetchExperts() }, [fetchExperts])

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setSearchTerm(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(t)
    }, [search])

    const handleCategoryChange = (cat) => {
        setCategory(cat)
        setPage(1)
    }

    return (
        <div className="page">
            {/* Header */}
            <div className="section-header" style={{ textAlign: 'center', marginBottom: 48 }}>
                <h1 style={{ fontSize: 48, marginBottom: 16 }}>
                    Find Your Expert 🚀
                </h1>
                <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto' }}>
                    Book 1-on-1 sessions with top industry professionals. Get personalized guidance and accelerate your growth.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="filter-bar" style={{ marginBottom: 40 }}>
                <div className="search-input-wrap" style={{ flex: 1 }}>
                    <span className="search-icon">🔍</span>
                    <input
                        id="search-input"
                        className="form-input"
                        type="text"
                        placeholder="Search experts by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="select-wrap">
                    <select
                        id="category-filter"
                        className="form-input"
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        style={{ minWidth: 180 }}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: 100,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: '1.5px solid',
                            borderColor: category === cat ? 'var(--primary)' : 'var(--border)',
                            background: category === cat ? 'rgba(108,99,255,0.2)' : 'var(--bg-input)',
                            color: category === cat ? 'var(--primary-light)' : 'var(--text-muted)',
                        }}
                    >{cat}</button>
                ))}
            </div>

            {/* Results count */}
            {!loading && (
                <div style={{ marginBottom: 24, color: 'var(--text-muted)', fontSize: 14 }}>
                    {pagination.total === 0
                        ? 'No experts found'
                        : `Showing ${experts.length} of ${pagination.total} experts`}
                    {searchTerm && <span style={{ color: 'var(--primary-light)' }}> for "{searchTerm}"</span>}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="error-state">
                    <div className="icon">😕</div>
                    <h3>Oops! Couldn't load experts</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={fetchExperts}>
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid-3">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Expert Grid */}
            {!loading && !error && experts.length === 0 && (
                <div className="empty-state">
                    <div className="icon">🔎</div>
                    <h3>No Experts Found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => { setSearch(''); setCategory('All'); setSearchTerm('') }}>
                        Clear Filters
                    </button>
                </div>
            )}

            {!loading && !error && experts.length > 0 && (
                <>
                    <div className="grid-3">
                        {experts.map((expert) => (
                            <ExpertCard key={expert._id} expert={expert} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                            >← Prev</button>

                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(i + 1)}
                                >{i + 1}</button>
                            ))}

                            <button
                                className="page-btn"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === pagination.totalPages}
                            >Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
