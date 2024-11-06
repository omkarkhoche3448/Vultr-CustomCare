const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json()); 
// Connect to MongoDB
mongoose.connect('mongodb+srv://root:admin@meetingtranscriptiondat.klfp4.mongodb.net/MeetingTranscriptionData', {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

  const meetingTranscriptionSchema = new mongoose.Schema({
    meetingId: String,
    transcriptions: [{
      timestamp: String,
      text: String,
      speaker: String
    }]
  });

const MeetingTranscription = mongoose.model('MeetingTranscription', meetingTranscriptionSchema);
  
  app.post('/api/transcription', async (req, res) => {
    try {
      const { meetingId, transcription } = req.body;
      
      let meetingTranscription = await MeetingTranscription.findOne({ meetingId });
      
      if (meetingTranscription) {
        // Push new transcription to array
        meetingTranscription.transcriptions.push({
          timestamp: transcription.timestamp,
          text: transcription.text,
          speaker: transcription.speaker
        });
        await meetingTranscription.save();
      } else {
        // Create new document with initial transcription
        meetingTranscription = await MeetingTranscription.create({
          meetingId,
          transcriptions: [{
            timestamp: transcription.timestamp,
            text: transcription.text,
            speaker: transcription.speaker
          }]
        });
      }
      
      res.status(200).send("Transcription updated");
    } catch (error) {
      console.error('Error saving transcription:', error);
      res.status(500).send("Error saving transcription");
    }
  });

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
