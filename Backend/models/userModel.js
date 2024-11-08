const vultrConfig = require('../config/vultrConfig');
const bcrypt = require('bcrypt');
require('dotenv').config();
task_bucket = process.env.TASK_BUCKET;
user_bucket = process.env.USER_BUCKET;
csv_bucket = process.env.CSV_BUCKET;

// Function to create or update a user in Vultr Object Storage
const saveUser = async (user) => {
    const key = `users/${user.email}.json`;
    const params = {
        Bucket: user_bucket,
        Key: key,
        Body: JSON.stringify(user),
        ContentType: 'application/json'
    };
    await vultrConfig.putObject(params).promise();
};

// Function to retrieve a user by email
const getUser = async (email) => {
    const key = `users/${email}.json`;
    try {
        const data = await vultrConfig.getObject({ Bucket: user_bucket, Key: key }).promise();
        return JSON.parse(data.Body.toString());
    } catch (error) {
        if (error.code === 'NoSuchKey') return null;
        throw error;
    }
};

module.exports = { saveUser, getUser };