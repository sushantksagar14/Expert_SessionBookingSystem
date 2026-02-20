const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expert',
            required: true,
        },
        slotId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        expertName: { type: String, required: true },
        userName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: { type: String, required: true, trim: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        notes: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

bookingSchema.index({ email: 1 });
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
