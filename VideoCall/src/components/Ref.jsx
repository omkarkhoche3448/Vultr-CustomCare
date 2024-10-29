import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, PhoneOff, Send, Timer, Copy, Check } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { Alert, AlertDescription } from './Alert';
import './VideoConference.css';

const VideoConference = () => {
  // ... (previous imports and initial states remain the same)

  // Modified transcription states
  const [fullTranscript, setFullTranscript] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('Representative'); // or 'User'
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const clientRef = useRef(null);
  const recognizerRef = useRef(null);
  const audioStreamRef = useRef(null);

  // Function to add new speech to transcript with speaker tag
  const addToTranscript = (speaker, text) => {
    setFullTranscript(prev => {
      const newEntry = `${speaker}: "${text.trim()}"\n`;
      return prev + newEntry;
    });
  };

  // Modified startTranscription function


  // Function to toggle speaker


  // Modified return JSX to include speaker toggle and transcript display
  return (
    <div className="video-conference">
      {/* ... (previous JSX remains the same until transcription container) */}

      {/* Updated Transcription Container */}
      

      {/* ... (rest of the JSX remains the same) */}
    </div>
  );
};

export default VideoConference;