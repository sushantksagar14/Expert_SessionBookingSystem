const Expert = require('../models/Expert');

// GET /api/experts  — search, filter, pagination
const getExperts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 6 } = req.query;

        const query = {};

        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Expert.countDocuments(query);
        const experts = await Expert.find(query)
            .select('-slots')           // omit slots in listing for performance
            .sort({ rating: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: experts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/experts/:id — full detail with slots
const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
        }
        res.json({ success: true, data: expert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getExperts, getExpertById };
