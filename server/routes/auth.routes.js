const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Captain = require('../models/Captain');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
};

// User Signup
router.post('/user/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id, 'user');
        res.status(201).json({ token, user: { id: user._id, name, email, role: 'user' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// User Login
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, 'user');
        res.json({ token, user: { id: user._id, name: user.name, email, role: 'user' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Captain Signup
router.post('/captain/signup', async (req, res) => {
    try {
        const { name, email, password, vehicle } = req.body;
        let captain = await Captain.findOne({ email });
        if (captain) return res.status(400).json({ message: 'Captain already exists' });

        captain = new Captain({ name, email, password, vehicle });
        await captain.save();

        const token = generateToken(captain._id, 'captain');
        res.status(201).json({ token, captain: { id: captain._id, name, email, role: 'captain' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Captain Login
router.post('/captain/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await Captain.findOne({ email });
        if (!captain) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(captain._id, 'captain');
        res.json({ token, captain: { id: captain._id, name: captain.name, email, role: 'captain' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
