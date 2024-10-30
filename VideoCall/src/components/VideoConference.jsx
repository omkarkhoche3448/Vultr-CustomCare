import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, PhoneOff, Send, Timer, Copy, Check } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { Alert, AlertDescription } from './Alert';
import './VideoConference.css';

const VideoConference = () => {
  const APP_ID = '0d93673aec684720b9126be9fbd575ae';
  const CHANNEL_PREFIX = 'meeting_';

  const consumers = [
    { name: "Soham Mhatre", email: "ichbinsoham@gmail.com" },
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Alex Johnson", email: "alex.j@example.com" },
    { name: "Sarah Wilson", email: "sarah.w@example.com" }
  ]
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cooldowns, setCooldowns] = useState({});
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});
  const [client, setClient] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [copied, setCopied] = useState(false);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const [error, setError] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [debugLog, setDebugLog] = useState([]);
  
  // New states for transcription
  const [fullTranscript, setFullTranscript] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('Representative'); // or 'User'
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const clientRef = useRef(null);
  const recognizerRef = useRef(null);
  const audioStreamRef = useRef(null);

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermissions(true);
      return true;
    } catch (error) {
      console.error('Permission check failed:', error);
      setError('Please grant camera and microphone permissions to start a meeting');
      setHasPermissions(false);
      return false;
    }
  };
  const joinChannel = async (channelName, token) => {
    try {
      addDebugLog('Starting join channel process...');
      
      if (!clientRef.current) {
        throw new Error('Agora client not initialized');
      }

      const hostUid = 1000;
      addDebugLog(`Joining channel ${channelName} as host with UID ${hostUid}`);
      await clientRef.current.join(APP_ID, channelName, token, hostUid);
      addDebugLog('Successfully joined channel');

      addDebugLog('Creating audio and video tracks...');
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      
      setLocalTracks([audioTrack, videoTrack]);
      addDebugLog('Local tracks created');

      const localPlayer = document.getElementById('local-video-container');
      if (localPlayer && videoTrack) {
        videoTrack.play(localPlayer);
        addDebugLog('Local video playing');
      }

      addDebugLog('Publishing tracks to channel...');
      await clientRef.current.publish([audioTrack, videoTrack]);
      addDebugLog('Tracks published successfully');

      setConnectionState('CONNECTED');
      setError(null);

      return { audioTrack, videoTrack };
    } catch (error) {
      addDebugLog(`Error in joinChannel: ${error.message}`);
      throw error;
    }
  };
  const addToTranscript = (speaker, text) => {
    setFullTranscript(prev => {
      const timestamp = new Date().toLocaleTimeString();
      const newEntry = `[${timestamp}] ${speaker}: "${text.trim()}"\n`;
      const updatedTranscript = prev + newEntry;
      
      // Log the update to console
      console.log('[Transcript Updated]');
      console.log('New Entry:', newEntry.trim());
      console.log('Full Transcript:', updatedTranscript);
      
      return updatedTranscript;
    });
  };
  const startTranscription = async (audioTrack) => {
    try {
      if (!audioTrack) {
        throw new Error('Audio track not provided');
      }

      addDebugLog('Starting transcription...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const speechConfig = speechsdk.SpeechConfig.fromSubscription(
        "3L9mmCFXqbJfQ7mqeCdb5UjTVFuwXlaox9VI27FMaV4urVaXn87gJQQJ99AJACGhslBXJ3w3AAAYACOGbUV6",
        "centralindia"
      );
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = speechsdk.AudioConfig.fromStreamInput(stream);
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;

      // Track interim results for each recognition session
      let interimResult = '';

      recognizer.recognizing = (_, event) => {
        if (event.result.text) {
          interimResult = event.result.text;
          console.log(`[Interim ${currentSpeaker}] ${interimResult}`);
        }
      };
      
      recognizer.recognized = (_, event) => {
        if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          const finalText = event.result.text.trim();
          if (finalText) {
            console.log(`[Final ${currentSpeaker}] ${finalText}`);
            
            // Only add to transcript if the final result is different from interim
            if (finalText !== interimResult.trim()) {
              addToTranscript(currentSpeaker, finalText);
            }
            
            // Reset interim result
            interimResult = '';
          }
        }
      };
      
      recognizer.canceled = (_, event) => {
        console.log(`[Transcription Canceled] Reason: ${event.reason}`);
        if (event.reason === speechsdk.CancellationReason.Error) {
          console.error(`[Transcription Error] ${event.errorDetails}`);
          setError(`Transcription error: ${event.errorDetails}`);
          addToTranscript('System', `Transcription Error: ${event.errorDetails}`);
        }
      };

      recognizer.sessionStarted = (_, event) => {
        console.log('[Transcription Session Started]');
        addToTranscript('System', 'Transcription Started');
      };

      recognizer.sessionStopped = (_, event) => {
        console.log('[Transcription Session Stopped]');
        addToTranscript('System', 'Transcription Stopped');
      };

      await recognizer.startContinuousRecognitionAsync();
      setIsTranscribing(true);
      addDebugLog('Transcription started successfully');
    } catch (error) {
      console.error('Transcription error:', error);
      setError(`Failed to start transcription: ${error.message}`);
      addDebugLog(`Transcription error: ${error.message}`);
      addToTranscript('System', `Error: ${error.message}`);
    }
  };

  const stopTranscription = async () => {
    try {
      if (recognizerRef.current) {
        await recognizerRef.current.stopContinuousRecognitionAsync();
        addToTranscript('System', 'Transcription Ended');
        recognizerRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      console.log('[Transcription] Stopping...');
      setIsTranscribing(false);
      addDebugLog('Transcription stopped successfully');
      console.log('[Transcription] Stopped successfully');
    } catch (error) {
      console.error('Error stopping transcription:', error);
      addDebugLog(`Error stopping transcription: ${error.message}`);
      addToTranscript('System', `Error Stopping Transcription: ${error.message}`);
    }
  };
  const leaveAndRemoveLocalStream = async () => {
    try {
      await stopTranscription();
      
      if (localTracks.length > 0) {
        localTracks.forEach(track => {
          track.stop();
          track.close();
        });
      }

      if (client) {
        await client.leave();
      }

      setLocalTracks([]);
      setRemoteUsers({});
      setActiveCall(null);
      setTranscribedText('');
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };
  useEffect(() => {
    const initializeAgoraClient = async () => {
      try {
        const permitted = await checkPermissions();
        if (!permitted) return;

        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = agoraClient;
        
        agoraClient.on('connection-state-change', (curState, prevState) => {
          setConnectionState(curState);
          addDebugLog(`Connection state changed from ${prevState} to ${curState}`);
          
          if (curState === 'DISCONNECTED') {
            stopTranscription();
            setError('Connection lost. Please try rejoining the call.');
            leaveAndRemoveLocalStream();
          }
        });

        agoraClient.on('error', (err) => {
          console.error('Agora client error:', err);
          setError(`Connection error: ${err.message}`);
        });

        agoraClient.on('user-published', handleUserJoined);
        agoraClient.on('user-left', handleUserLeft);
        
        setClient(agoraClient);
        addDebugLog('Agora client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize:', error);
        setError('Failed to initialize video conference system');
        addDebugLog(`Initialization error: ${error.message}`);
      }
    };

    initializeAgoraClient();

    return () => {
      if (clientRef.current) {
        leaveAndRemoveLocalStream();
        clientRef.current.removeAllListeners();
        clientRef.current = null;
      }
    };
  }, []);
  const handleUserJoined = async (user, mediaType) => {
    addDebugLog(`Remote user ${user.uid} joined with ${mediaType}`);
    try {
      if (!clientRef.current) {
        throw new Error('Client not initialized');
      }
      
      await clientRef.current.subscribe(user, mediaType);
      addDebugLog(`Subscribed to ${mediaType} from user ${user.uid}`);

      if (mediaType === 'video') {
        const remotePlayer = document.getElementById('remote-video-container');
        if (remotePlayer) {
          user.videoTrack.play(remotePlayer);
          addDebugLog(`Playing remote video from user ${user.uid}`);
        }
      }

      if (mediaType === 'audio') {
        user.audioTrack.play();
        addDebugLog(`Playing remote audio from user ${user.uid}`);
      }

      setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
    } catch (error) {
      addDebugLog(`Error handling user joined: ${error.message}`);
      // Retry subscription after a short delay
      setTimeout(() => {
        if (clientRef.current) {
          handleUserJoined(user, mediaType);
        }
      }, 1000);
    }
  };



  const addDebugLog = (message) => {
    console.log(`[Host Debug] ${message}`);
    setDebugLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };




  // Start cooldown timer effect
  useEffect(() => {
    const timers = {};
    
    Object.keys(cooldowns).forEach(email => {
      if (cooldowns[email] > 0) {
        timers[email] = setInterval(() => {
          setCooldowns(prev => ({
            ...prev,
            [email]: Math.max(0, prev[email] - 1)
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, [cooldowns]);

  const generateAgoraToken = async (channelName, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('http://localhost:5000/api/generate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelName,
            role: 'publisher',
            appId: APP_ID,
            appCertificate: '33f9a027a70f48bab96ba233ea13781f',
            uid: 0,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { token } = await response.json();
        return token;
      } catch (error) {
        console.error(`Token generation attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateMeetingLink = async (email) => {
    try {
      if (activeCall) {
        await leaveAndRemoveLocalStream();
      }

      const channelName = `${CHANNEL_PREFIX}${Date.now()}`;
      addDebugLog(`Generating meeting for channel: ${channelName}`);

      const token = await generateAgoraToken(channelName);
      addDebugLog('Token generated successfully');

      const meetingId = Math.random().toString(36).substring(7);
      const fullUrl = `${window.location.origin}/join/${channelName}/${token}/${meetingId}`;
      
      setSelectedEmail(email);
      setMeetingLink(fullUrl);
      setShowAlert(true);
      
      addDebugLog('Attempting to join channel as host...');
      const { audioTrack } = await joinChannel(channelName, token);
      
      // Start transcription after tracks are initialized
      await startTranscription(audioTrack);
      
      setActiveCall({ channelName, token, meetingId });

      setCooldowns(prev => ({
        ...prev,
        [email]: 5
      }));

    } catch (error) {
      addDebugLog(`Error generating meeting: ${error.message}`);
      setError('Failed to generate meeting. Please try again.');
      setActiveCall(null);
    }
  };


  


  const handleUserLeft = (user) => {
    setRemoteUsers(prev => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
  };


  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        stopTranscription();
      }
    };
  }, []);

  const toggleMic = async () => {
    if (localTracks[0]) {
      await localTracks[0].setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };
  const toggleSpeaker = () => {
    setCurrentSpeaker(prev => prev === 'Representative' ? 'User' : 'Representative');
  };

  const toggleCamera = async () => {
    if (localTracks[1]) {
      await localTracks[1].setEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  return (
    <div className="video-conference">
      {/* Left Column - Consumers List */}
      <div className="consumers-section">
        <h2 className="consumers-title">Consumers</h2>
        <div className="consumer-list">
          {consumers.map((consumer) => (
            <div key={consumer.email} className="consumer-card">
              <h3 className="consumer-name">{consumer.name}</h3>
              <p className="consumer-email">{consumer.email}</p>
              <button
                onClick={() => generateMeetingLink(consumer.email)}
                disabled={cooldowns[consumer.email] > 0 || activeCall}
                className="invite-button"
              >
                {cooldowns[consumer.email] > 0 ? (
                  <>
                    <Timer size={16} />
                    {cooldowns[consumer.email]}s
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {activeCall ? 'In Call' : 'Invite'}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column - Videos and Controls */}
      <div className="videos-section">
        <div className="videos-container">
          <div className="video-frame">
            <div id="local-video-container">
              {!localTracks.length && 'Your Video'}
            </div>
          </div>
          
          <div className="video-frame">
            <div id="remote-video-container">
              {Object.keys(remoteUsers).length === 0 && 'Consumer Video'}
            </div>
          </div>
          
          <div className="controls-container">
            <button
              onClick={toggleCamera}
              disabled={!localTracks.length}
              className={`control-button camera ${!isCameraOn ? 'off' : ''}`}
            >
              <Camera size={24} />
            </button>
            <button
              onClick={toggleMic}
              disabled={!localTracks.length}
              className={`control-button mic ${!isMicOn ? 'off' : ''}`}
            >
              <Mic size={24} />
            </button>
            <button
              onClick={leaveAndRemoveLocalStream}
              disabled={!activeCall}
              className="control-button end-call"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Transcription */}
      <div className="transcription-section">
        <div className="transcription-header">
          <div className="transcription-status">
            <div className="status-indicator">
              <div className={`status-dot ${isTranscribing ? 'active' : 'inactive'}`}></div>
              <span>{isTranscribing ? 'Transcription Active' : 'Transcription Inactive'}</span>
            </div>
            {isTranscribing && (
              <button 
                onClick={toggleSpeaker}
                className="speaker-button"
              >
                Speaker: {currentSpeaker}
              </button>
            )}
          </div>
        </div>
        <div className="transcription-content">
          <pre className="transcription-text">
            {fullTranscript || 'Waiting for speech...'}
          </pre>
        </div>
      </div>

      {/* Meeting Link Alert Modal */}
      {showAlert && (
        <div className="meeting-link-modal">
          <div className="modal-header">
            <h3 className="modal-title">Meeting Link</h3>
            <button 
              onClick={() => setShowAlert(false)}
              className="close-button"
            >
              ×
            </button>
          </div>
          <p>Meeting link generated for {selectedEmail}:</p>
          <div className="meeting-link-box">
            {meetingLink}
          </div>
          <button
            onClick={() => copyToClipboard(meetingLink)}
            className="copy-button"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}

      {/* Debug Log */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-log">
          {debugLog.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
};


export default VideoConference;