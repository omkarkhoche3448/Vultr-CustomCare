// config/database.js
const AWS = require('aws-sdk');
require('dotenv').config();

const vultrConfig = {
    endpoint: new AWS.Endpoint(process.env.VULTR_ENDPOINT || 'blr1.vultrobjects.com'),
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY
};

const s3 = new AWS.S3(vultrConfig);
const BUCKET_NAME = process.env.BUCKET_NAME || 'login-signup-bucket';

const saveUserData = async (username, data) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `users/${username}.json`,
        Body: JSON.stringify(data),
        ContentType: 'application/json'
    };
    await s3.putObject(params).promise();
};

const getUserData = async (username) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `users/${username}.json`
    };
    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (err) {
        return null;
    }
};

const saveTaskData = async (taskId, data) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `tasks/${taskId}.json`,
        Body: JSON.stringify(data),
        ContentType: 'application/json'
    };
    await s3.putObject(params).promise();
};

const getTaskData = async (taskId) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `tasks/${taskId}.json`
    };
    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (err) {
        return null;
    }
};

module.exports = {
    saveUserData,
    getUserData,
    saveTaskData,
    getTaskData,
    s3,
    BUCKET_NAME
};
