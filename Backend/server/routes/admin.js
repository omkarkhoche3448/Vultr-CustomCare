const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const { authenticateJwt, isAdmin, JWT_SECRET } = require('../middleware/auth');
const { saveUserData, getUserData, saveTaskData } = require('../config/database');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password, deviceInfo } = req.body;
        const userData = await getUserData(username);

        if (!userData || userData.role !== 'admin') {
            return res.status(401).json({
                status: 'error',
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials'
            });
        }

        const validPassword = await bcrypt.compare(password, userData.password);
        if (!validPassword) {
            return res.status(401).json({
                status: 'error',
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: username, role: 'ADMIN' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            status: 'success',
            data: {
                token,
                refreshToken: 'dummy-refresh-token', // Implement proper refresh token logic
                adminId: username,
                username: userData.username,
                role: 'ADMIN',
                permissions: userData.permissions || [],
                expiresIn: 3600
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: 'SERVER_ERROR',
            message: 'Internal server error'
        });
    }
});

router.post('/tasks/add-tasks', authenticateJwt, isAdmin, upload.single('customersFile'), async (req, res) => {
    try {
        const {
            title,
            description,
            script,
            uniqueProposition,
            generateScript,
            priority,
            deadline,
            metadata
        } = req.body;

        const assignedSalesReps = Array.isArray(req.body.assignedSalesReps) 
            ? req.body.assignedSalesReps 
            : JSON.parse(req.body.assignedSalesReps || '[]');

        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                code: 'NO_FILE',
                message: 'Customer file is required'
            });
        }

        // Process CSV file
        const customerData = {
            totalCustomers: 0,
            validEntries: 0,
            invalidEntries: []
        };

        // Create task
        const taskId = Date.now().toString();
        const taskData = {
            taskId,
            title,
            description,
            script,
            uniqueProposition,
            priority,
            deadline,
            metadata,
            assignedSalesReps,
            customerData,
            createdAt: new Date().toISOString()
        };

        await saveTaskData(taskId, taskData);

        res.json({
            status: 'success',
            data: {
                taskId,
                title,
                createdAt: taskData.createdAt,
                generatedScript: generateScript ? 'Generated script content' : null,
                assignedReps: assignedSalesReps.map(salesId => ({
                    salesId,
                    name: 'Sales Rep Name', // Fetch actual names
                    assignedCustomers: Math.floor(customerData.validEntries / assignedSalesReps.length)
                })),
                customerData
            }
        });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({
            status: 'error',
            code: 'SERVER_ERROR',
            message: 'Internal server error'
        });
    }
});
// Implement other admin routes...

module.exports = router;
