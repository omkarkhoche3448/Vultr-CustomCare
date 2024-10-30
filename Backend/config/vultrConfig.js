const AWS = require('aws-sdk');
require('dotenv').config();

const vultrConfig = new AWS.S3({
  accessKeyId: process.env.VULTR_ACCESS_KEY,
  secretAccessKey: process.env.VULTR_SECRET_KEY,
  endpoint: process.env.VULTR_ENDPOINT,
  s3ForcePathStyle: true, // Required for Vultr compatibility
});

module.exports = vultrConfig;
