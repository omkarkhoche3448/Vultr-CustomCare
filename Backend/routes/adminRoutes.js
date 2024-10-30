const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Route to create a new task
router.post('/create-task', authenticate, authorizeAdmin, adminController.createTask);

// Route to assign a task to a representative
router.post('/assign-task', authenticate, authorizeAdmin, adminController.assignTask);

// Route to fetch all representatives
router.get('/representatives', authenticate, authorizeAdmin, adminController.getRepresentatives);

// Route to fetch tasks
router.get('/tasks', authenticate, authorizeAdmin, adminController.fetchTasks);


// Route to upload CSV
// Set up multer for file handling
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// Route for uploading CSV
router.post('/upload-csv', authenticate, authorizeAdmin, upload.single('file'), adminController.uploadCSV);


// Route to get customer data from uploaded CSV
router.get('/customers', authenticate, authorizeAdmin, adminController.getCustomerData);

module.exports = router;
