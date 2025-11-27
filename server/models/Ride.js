const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
    pickup: {
        address: String,
        lat: Number,
        lon: Number
    },
    destination: {
        address: String,
        lat: Number,
        lon: Number
    },
    status: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    fare: Number,
    duration: Number,
    distance: Number,
    otp: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
