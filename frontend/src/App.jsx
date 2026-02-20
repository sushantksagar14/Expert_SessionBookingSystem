import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ExpertListing from './pages/ExpertListing'
import ExpertDetail from './pages/ExpertDetail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'

export default function App() {
    return (
        <>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<ExpertListing />} />
                    <Route path="/experts/:id" element={<ExpertDetail />} />
                    <Route path="/book/:id" element={<Booking />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                </Routes>
            </main>
        </>
    )
}
