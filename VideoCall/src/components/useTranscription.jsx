import React, { useState, useEffect, useCallback } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const useTranscription = ({ isHost, onTranscriptionUpdate }) => {
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  
  // Replace with your Azure Speech Service credentials
  const SPEECH_KEY = '3L9mmCFXqbJfQ7mqeCdb5UjTVFuwXlaox9VI27FMaV4urVaXn87gJQQJ99AJACGhslBXJ3w3AAAYACOGbUV6';
  const SPEECH_REGION = 'centralindia';

  const startTranscription = useCallback(() => {
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    
    const newRecognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    newRecognizer.recognized = (s, e) => {
      if (e.result.text && e.result.text.trim() !== '') {
        onTranscriptionUpdate({
          text: e.result.text,
          timestamp: new Date().toISOString(),
          isHost: isHost,
        });
      }
    };

    newRecognizer.startContinuousRecognitionAsync();
    setRecognizer(newRecognizer);
    setTranscriptionEnabled(true);
  }, [isHost, onTranscriptionUpdate]);

  const stopTranscription = useCallback(() => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
      setRecognizer(null);
      setTranscriptionEnabled(false);
    }
  }, [recognizer]);

  useEffect(() => {
    return () => {
      stopTranscription();
    };
  }, [stopTranscription]);

  return {
    transcriptionEnabled,
    startTranscription,
    stopTranscription
  };
};

export default useTranscription;