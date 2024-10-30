const express = require('express');
const { authenticate, authorizeRepresentative } = require('../middlewares/authMiddleware');
const repController = require('../controllers/repController');
const router = express.Router();

// Route for representatives to fetch their assigned tasks
router.get('/assigned-tasks', authenticate, authorizeRepresentative, repController.getAssignedTasks);

module.exports = router;
