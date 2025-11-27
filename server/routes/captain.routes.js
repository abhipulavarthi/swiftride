const express = require('express');
const router = express.Router();
const Captain = require('../models/Captain');
const auth = require('../middleware/auth');

// Update Location
router.post('/location', auth, async (req, res) => {
    if (req.user.role !== 'captain') return res.status(403).json({ message: 'Access denied' });
    try {
        const { lat, lon } = req.body;
        await Captain.findByIdAndUpdate(req.user.id, { location: { lat, lon } });
        res.json({ message: 'Location updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location' });
    }
});

module.exports = router;
