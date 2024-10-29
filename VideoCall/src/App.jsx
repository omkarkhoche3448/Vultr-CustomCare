import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AgoraUIKit from 'agora-react-uikit';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import 'agora-react-uikit/dist/index.css';

const APP_ID = '0d93673aec684720b9126be9fbd575ae';
const SPEECH_KEY = "3L9mmCFXqbJfQ7mqeCdb5UjTVFuwXlaox9VI27FMaV4urVaXn87gJQQJ99AJACGhslBXJ3w3AAAYACOGbUV6";
const SPEECH_REGION = "centralindia";

const SpeechTranscription = ({ isCallActive }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [recognizer, setRecognizer] = useState(null);

  const startRecognition = React.useCallback(() => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);

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

const App = () => {
  const [videoCall, setVideoCall] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    const meetingId = searchParams.get('meeting');
    if (meetingId) {
      setChannelName(meetingId);
    }
  }, [searchParams]);

  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const rtcProps = {
    appId: APP_ID,
    channel: channelName,
    token: null, // Use null for testing mode
    layout: true,
    enableScreensharing: true,
    disableRtm: true,
    role: 'host',
    maxUsers: 3,
    uid: Math.floor(Math.random() * 100000),
  };

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      navigate('/');
    },
    UserJoined: (user) => {
      setActiveUsers(prev => {
        const newCount = prev + 1;
        if (newCount > 2) {
          alert('Meeting is full!');
          return prev;
        }
        return newCount;
      });
      console.log('User joined:', user);
    },
    UserLeft: (user) => {
      setActiveUsers(prev => Math.max(0, prev - 1));
      console.log('User left:', user);
    },
    MediaDeviceChanged: (device) => {
      console.log('Media device changed:', device);
    },
    LocalMuteChanged: (muted) => {
      setIsMuted(muted);
    },
    LocalVideoChanged: (enabled) => {
      setIsVideoEnabled(enabled);
    },
  };

  const createMeeting = () => {
    const newMeetingId = generateMeetingId();
    const meetingUrl = `${window.location.origin}?meeting=${newMeetingId}`;
    setChannelName(newMeetingId);
    navigate(`?meeting=${newMeetingId}`);
    
    // Create a temporary input element to copy the URL
    const tempInput = document.createElement('input');
    tempInput.value = meetingUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    alert(`Meeting URL copied to clipboard!\n${meetingUrl}`);
    setVideoCall(true);
  };

  const joinMeeting = () => {
    if (!channelName) {
      alert('Please enter a meeting ID');
      return;
    }
    setVideoCall(true);
  };

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    formContainer: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      width: '100%',
      maxWidth: '400px',
      transition: 'transform 0.2s ease',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      margin: '0.5rem 0',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    createButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      '&:hover': {
        backgroundColor: '#4338ca',
      },
    },
    joinButton: {
      backgroundColor: '#10b981',
      color: 'white',
      '&:hover': {
        backgroundColor: '#059669',
      },
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      margin: '0.5rem 0',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#4f46e5',
      },
    },
    heading: {
      textAlign: 'center',
      color: '#1f2937',
      marginBottom: '1.5rem',
      fontSize: '1.875rem',
      fontWeight: '700',
    },
    statusBar: {
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 50,
    },
  };

  return videoCall ? (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={styles.statusBar}>
        <span>👥 {activeUsers + 1} participants</span>
        <span>|</span>
        <span>{isMuted ? '🔇 Muted' : '🎤 Unmuted'}</span>
        <span>|</span>
        <span>{isVideoEnabled ? '📹 Video On' : '🎦 Video Off'}</span>
      </div>
      
      <AgoraUIKit
        rtcProps={rtcProps}
        callbacks={callbacks}
        styleProps={{
          localBtnContainer: { backgroundColor: 'rgba(0,0,0,0.7)' },
          remoteBtnContainer: { backgroundColor: 'rgba(0,0,0,0.7)' },
          minViewContainer: { backgroundColor: '#f7f7f7' },
          maxViewContainer: { backgroundColor: '#f7f7f7' },
          gridVideoContainer: { backgroundColor: '#f7f7f7' },
          pinnedVideoContainer: { backgroundColor: '#f7f7f7' },
        }}
      />
      
      <SpeechTranscription isCallActive={videoCall} />
    </div>
  ) : (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Video Meeting</h1>
        <button
          onClick={createMeeting}
          style={{ ...styles.button, ...styles.createButton }}
        >
          Create New Meeting
        </button>
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Enter meeting ID"
          style={styles.input}
        />
        <button
          onClick={joinMeeting}
          style={{ ...styles.button, ...styles.joinButton }}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default App;