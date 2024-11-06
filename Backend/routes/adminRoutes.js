const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
vultr_llama_endpoint = process.env.VULTR_LLAMA_ENDPOINT;


// Route to create a new task
// router.post('/create-task', authenticate, authorizeAdmin, adminController.createTask);

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

// Middleware to check GenAI authorization header
const checkGenAIToken = (req, res, next) => {
    const genAIToken = req.headers['genai-auth'];

    if (!genAIToken || genAIToken !== vultr_llama_endpoint) {
        console.log(genAIToken);
        return res.status(401).json({ message: 'Unauthorized: Invalid GenAI token' });
    }
    // console.log("token agya");
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

router.post('/generate-script', bodyParser.json(), authenticate, authorizeAdmin, checkGenAIToken, adminController.generate_script);

// route to get the keywords from the script

router.get('/generate-keywords', bodyParser.json(), authenticate, authorizeAdmin, checkGenAIToken, adminController.generate_keywords);


module.exports = router;
