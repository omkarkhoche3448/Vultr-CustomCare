// routes/user.js
require('dotenv').config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { saveUserData, getUserData } = require('../db/index');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// routes/user.js
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed Password:", hashedPassword); // Add this to confirm the hash

    const userId = Date.now().toString();
    await saveUserData(username, { username, password: hashedPassword, role });
    res.status(201).json({ status: 'success', message: 'User registered successfully' });
});

// routes/user.js
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userData = await getUserData(username);
    console.log("Fetched User Data:", userData); // Add this line to inspect fetched data

    if (!userData) {
        return res.status(401).json({ status: 'error', code: 'INVALID_CREDENTIALS', message: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
        return res.status(401).json({ status: 'error', code: 'INVALID_CREDENTIALS', message: 'Incorrect password.' });
    }

    if (userData.role !== 'user') {
        return res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: 'You are an Admin.' });
    }
    const token = jwt.sign({ userId: username, role: userData.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
        status: 'success',
        data: {
            token,
            refreshToken: 'dummy-refresh-token',
            username: userData.username,
            role: userData.role,
            permissions: [],
            expiresIn: 3600
        }
    });
});

module.exports = router;