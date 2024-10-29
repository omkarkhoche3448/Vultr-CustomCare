const AWS = require('aws-sdk');

require('dotenv').config();

const vultrConfig = {
    endpoint: new AWS.Endpoint(process.env.VULTR_ENDPOINT || 'blr1.vultrobjects.com'),
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY
};

const s3 = new AWS.S3(vultrConfig);
const BUCKET_NAME = process.env.BUCKET_NAME || 'login-signup-bucket';

// Function to save user data (uses username as the key for simplicity)
const saveUserData = async (username, data) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `users/${username}.json`, // Store using username as key (corrected string interpolation)
        Body: JSON.stringify(data),
        ContentType: 'application/json'
    };
    await s3.putObject(params).promise();
};

// Function to retrieve user data by username
const getUserData = async (username) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `users/${username}.json` // Corrected string interpolation
    };
    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (err) {
        return null; // Return null if user data is not found
    }
};

module.exports = {
    saveUserData,
    getUserData
};
