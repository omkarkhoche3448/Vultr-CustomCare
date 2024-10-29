import React, { useState, useEffect, useCallback } from 'react';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const SPEECH_KEY = "3L9mmCFXqbJfQ7mqeCdb5UjTVFuwXlaox9VI27FMaV4urVaXn87gJQQJ99AJACGhslBXJ3w3AAAYACOGbUV6";
const SPEECH_REGION = "centralindia";

const SpeechTranscription = ({ isCallActive }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [recognizer, setRecognizer] = useState(null);

  const startRecognition = useCallback(() => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';

    // Create audio config from default microphone
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    
    // Create conversation transcriber
    const conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);

    // Handle transcription events
    conversationTranscriber.transcribed = (s, e) => {
      if (e.result.text.trim() !== '') {
        setTranscripts(prev => [...prev, {
          text: e.result.text,
          speakerId: e.result.speakerId || 'unknown',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    conversationTranscriber.canceled = (s, e) => {
      console.log(`Transcription canceled: ${e.errorDetails}`);
    };

    conversationTranscriber.sessionStarted = (s, e) => {
      console.log(`Session started: ${e.sessionId}`);
    };

    conversationTranscriber.sessionStopped = (s, e) => {
      console.log(`Session stopped: ${e.sessionId}`);
    };

    // Start transcribing
    conversationTranscriber.startTranscribingAsync(
      () => {
        console.log('Transcription started successfully');
      },
      (err) => {
        console.error(`Error starting transcription: ${err}`);
      }
    );

    setRecognizer(conversationTranscriber);
    
    return conversationTranscriber;
  }, []);

  useEffect(() => {
    let currentRecognizer = null;

    if (isCallActive) {
      currentRecognizer = startRecognition();
    }

    return () => {
      if (currentRecognizer) {
        currentRecognizer.stopTranscribingAsync(
          () => {
            console.log('Transcription stopped successfully');
          },
          (err) => {
            console.error(`Error stopping transcription: ${err}`);
          }
        );
      }
    };
  }, [isCallActive, startRecognition]);

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 bg-blue-600 text-white font-semibold">
        Live Transcription
      </div>
      <div className="p-4 h-80 overflow-y-auto">
        {transcripts.map((transcript, index) => (
          <div key={index} className="mb-2">
            <span className="text-xs text-gray-500">{transcript.timestamp}</span>
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-blue-600">
                {transcript.speakerId}:
              </span>
              <span className="text-sm">{transcript.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeechTranscription;