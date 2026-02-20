const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    date: { type: String, required: true },       // "YYYY-MM-DD"
    time: { type: String, required: true },       // "10:00 AM"
    isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: ['Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Health', 'Education', 'Legal'],
        },
        experience: { type: Number, required: true },   // years
        rating: { type: Number, min: 1, max: 5, default: 4.0 },
        bio: { type: String, required: true },
        imageUrl: { type: String, default: '' },
        hourlyRate: { type: Number, default: 500 },      // INR
        slots: [slotSchema],
    },
    { timestamps: true }
);

// Text index for name search
expertSchema.index({ name: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
