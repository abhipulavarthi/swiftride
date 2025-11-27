const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');

// Create Ride (User)
router.post('/create', auth, async (req, res) => {
    try {
        const { pickup, destination, vehicleType, fare, distance, duration } = req.body;
        const ride = new Ride({
            user: req.user.id,
            pickup,
            destination,
            fare,
            distance,
            duration,
            status: 'pending',
            otp: Math.floor(1000 + Math.random() * 9000).toString()
        });
        await ride.save();

        const io = req.app.get('socketio');
        io.emit('new-ride', ride);

        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ride', error: error.message });
    }
});

// Get Pending Rides (Captain)
router.get('/pending', auth, async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'pending' }).populate('user', 'name');
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rides' });
    }
});

// Accept Ride (Captain)
router.post('/accept/:id', auth, async (req, res) => {
    if (req.user.role !== 'captain') return res.status(403).json({ message: 'Only captains can accept rides' });

    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.status !== 'pending') return res.status(400).json({ message: 'Ride already accepted' });

        ride.status = 'accepted';
        ride.captain = req.user.id;
        await ride.save();

        const rideWithDetails = await Ride.findById(ride._id).populate('captain', 'name vehicle').populate('user', 'name');

        const io = req.app.get('socketio');
        io.emit('ride-update', rideWithDetails);

        res.json(rideWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting ride' });
    }
});

module.exports = router;
