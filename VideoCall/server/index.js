const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const PORT = process.env.PORT || 3000;
const APP_ID = '0d93673aec684720b9126be9fbd575ae';
const APP_CERTIFICATE = '33f9a027a70f48bab96ba233ea13781f';

// MongoDB Connection
mongoose.connect('mongodb+srv://root:admin@meetingtranscriptiondat.klfp4.mongodb.net/MeetingTranscriptionData', {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// MongoDB Schema
const meetingTranscriptionSchema = new mongoose.Schema({
  meetingId: String,
  transcriptions: [{
    timestamp: String,
    text: String,
    speaker: String
  }]
});

const MeetingTranscription = mongoose.model('MeetingTranscription', meetingTranscriptionSchema);

// Routes

// Generate Agora token
app.post('/api/generate-token', async (req, res) => {
  try {
    const { channelName, role = 'publisher', uid = 0 } = req.body;

    if (!channelName) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + 3600;
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      userRole,
      expirationTimeInSeconds
    );
    console.log(token);

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

// Save transcription
app.post('/api/transcription', async (req, res) => {
  try {
    const { meetingId, transcription } = req.body;
    
    let meetingTranscription = await MeetingTranscription.findOne({ meetingId });
    
    if (meetingTranscription) {
      meetingTranscription.transcriptions.push({
        timestamp: transcription.timestamp,
        text: transcription.text,
        speaker: transcription.speaker
      });
      await meetingTranscription.save();
    } else {
      meetingTranscription = await MeetingTranscription.create({
        meetingId,
        transcriptions: [{
          timestamp: transcription.timestamp,
          text: transcription.text,
          speaker: transcription.speaker
        }]
      });
    }
    
    res.status(200).json({ message: "Transcription updated successfully" });
  } catch (error) {
    console.error('Error saving transcription:', error);
    res.status(500).json({ error: "Error saving transcription" });
  }
});
// Get meeting transcriptions by meetingId
app.get('/api/transcription/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    // Validate meetingId
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }

    // Find meeting transcription document
    const meetingTranscription = await MeetingTranscription.findOne({ meetingId });
    
    // If no meeting found with the provided ID
    if (!meetingTranscription) {
      return res.status(404).json({ 
        error: 'Meeting not found',
        meetingId 
      });
    }

    // Return the full meeting transcription object
    res.status(200).json({
      success: true,
      data: meetingTranscription
    });

  } catch (error) {
    console.error('Error fetching meeting transcription:', error);
    res.status(500).json({ 
      error: "Error fetching meeting transcription",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 