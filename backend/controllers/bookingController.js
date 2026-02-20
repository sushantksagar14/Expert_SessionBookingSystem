const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// POST /api/bookings — create booking with race-condition-safe atomic update
const createBooking = async (req, res) => {
    const { expertId, slotId, userName, email, phone, date, timeSlot, notes } = req.body;

    // Validate required fields
    if (!expertId || !slotId || !userName || !email || !phone || !date || !timeSlot) {
        return res.status(400).json({
            success: false,
            message: 'All required fields must be provided: expertId, slotId, userName, email, phone, date, timeSlot',
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ success: false, message: 'Phone must be a valid 10-digit number' });
    }

    try {
        // ─── ATOMIC double-booking prevention ──────────────────────────────────────
        // Only updates the slot if isBooked is currently false
        const updatedExpert = await Expert.findOneAndUpdate(
            {
                _id: expertId,
                'slots._id': slotId,
                'slots.isBooked': false,
            },
            { $set: { 'slots.$.isBooked': true } },
            { new: true }
        );

        if (!updatedExpert) {
            return res.status(409).json({
                success: false,
                message: 'This slot is already booked. Please choose another slot.',
            });
        }

        // Create the booking record
        const booking = await Booking.create({
            expertId,
            slotId,
            expertName: updatedExpert.name,
            userName,
            email: email.toLowerCase(),
            phone,
            date,
            timeSlot,
            notes: notes || '',
        });

        // ─── Emit real-time event via Socket.io ────────────────────────────────────
        const io = req.app.get('io');
        if (io) {
            io.emit('slotBooked', { expertId, slotId });
        }

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        // Unique index violation — extra safety net
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This slot is already booked. Please choose another slot.',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/bookings?email= — fetch bookings by email
const getBookings = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }

    try {
        const bookings = await Booking.find({ email: email.toLowerCase() })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/bookings/:id/status — update booking status
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed'];

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Emit status update in real-time
        const io = req.app.get('io');
        if (io) {
            io.emit('bookingStatusUpdated', { bookingId: booking._id, status });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
