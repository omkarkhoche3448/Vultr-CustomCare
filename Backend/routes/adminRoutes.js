const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();

const mistralApiKey = process.env.MISTRAL_API_KEY;


// Route to create a new task
// router.post('/create-task', authenticate, authorizeAdmin, adminController.createTask);
router.post('/create-task',adminController.createTask);

// Route to fetch all representatives
// router.get('/representatives', authenticate, authorizeAdmin, adminController.getRepresentatives);
router.get('/representatives', adminController.getRepresentatives);

// Route to fetch tasks
// router.get('/tasks', authenticate, authorizeAdmin, adminController.fetchTasks);
router.get('/tasks',  adminController.fetchTasks);

    
// Route to upload CSV
// Set up multer for file handling
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// Route for uploading CSV
router.post('/upload-csv', authenticate, authorizeAdmin, upload.single('file'), adminController.uploadCSV);


// Route to get customer data from uploaded CSV
// router.get('/customers', authenticate, authorizeAdmin, adminController.getCustomerData);
router.get('/customers',  adminController.getCustomerData);

// Middleware to check Mistral AI authorization header
const checkGenAIToken = (req, res, next) => {
    const genAIToken = req.headers['genai-auth'];

    if (!genAIToken || genAIToken.trim() !== mistralApiKey.trim()) {
        console.log('Invalid Mistral API key provided:', genAIToken);
        return res.status(401).json({ message: 'Unauthorized: Invalid Mistral API key' });
    }
    console.log("Mistral API key verified successfully");
    next();
};



// route to generate the script with given description and task
// and idiots till here description includes following ( NOT NECESSARY )
/*
description
└── CustomerProfile
    ├── Demographic
    ├── Lifestyle
    └── TechSavviness
└── NeedsAndPainPoints
    ├── Desire
    ├── Need
    ├── Importance
    ├── Preference
    └── Budget
└── PotentialProductPropositions
    ├── Multiple specs of the product
*/

// router.post('/generate-script', bodyParser.json(), authenticate, authorizeAdmin, checkGenAIToken, adminController.generate_script);
router.post('/generate-script', checkGenAIToken, adminController.generate_script);

// route to get the keywords from the script

router.post('/generate-keywords', bodyParser.json(), checkGenAIToken, adminController.generate_keywords);

module.exports = router;
