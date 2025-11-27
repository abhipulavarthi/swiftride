const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const captainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicle: {
        color: String,
        plate: String,
        capacity: Number,
        vehicleType: { type: String, enum: ['bike', 'auto', 'cab'] }
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    location: {
        lat: Number,
        lon: Number
    }
});

captainSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

captainSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Captain', captainSchema);
