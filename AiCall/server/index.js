// index.js
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants from your configuration
const PORT = process.env.PORT || 5000;
const APP_ID = '0d93673aec684720b9126be9fbd575ae';
const APP_CERTIFICATE = '33f9a027a70f48bab96ba233ea13781f';

// Endpoint to generate token
app.post('/api/generate-token', async (req, res) => {
  try {
    const { channelName, role = 'publisher', uid = 0 } = req.body;

    if (!channelName) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    // Set token expiry time (1 hour from now)
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + 3600;

    // Set role
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      userRole,
      expirationTimeInSeconds
    );
    console.log(token);

    // Send response
    res.json({
      token,
      channelName,
      uid,
      role,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});