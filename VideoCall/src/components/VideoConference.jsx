import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, PhoneOff, Send, Timer, Copy, Check } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Alert, AlertDescription } from './Alert';
import './VideoConference.css';
import useTranscription from './useTranscription';
import { initSocket } from './socket';

const VideoConference = () => {
  const APP_ID = '37df06af651b4147bfb6ad522b350d13';
  const CHANNEL_PREFIX = 'meeting_';

  const consumers = [
    { name: "Soham Mhatre", email: "ichbinsoham@gmail.com" },
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Alex Johnson", email: "alex.j@example.com" },
    { name: "Sarah Wilson", email: "sarah.w@example.com" }
  ];
  const [socket, setSocket] = useState(null);

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
  const [transcriptions, setTranscriptions] = useState([]);
  
  const clientRef = useRef(null);
// VideoConference.jsx - Host side
useEffect(() => {
  const newSocket = initSocket();
  setSocket(newSocket);

  console.log('[Host] Socket initialized');

  newSocket.on('transcription', (data) => {
    console.log('[Host] Received transcription:', data);
    if (data.channelName === activeCall?.channelName) {
      console.log('[Host] Adding consumer transcription to state');
      setTranscriptions(prev => [...prev, {
        text: data.text,
        timestamp: data.timestamp,
        isHost: false
      }]);
    }
  });

  return () => {
    console.log('[Host] Socket disconnecting');
    newSocket.disconnect();
  };
}, []);
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
// VideoConference.jsx - Host side
const handleTranscriptionUpdate = (transcription) => {
  console.log('[Host] Sending transcription:', {
    text: transcription,
    timestamp: new Date().toISOString(),
    isHost: true,
    channelName: activeCall?.channelName
  });

  if (socket && activeCall) {
    socket.emit('transcription', {
      text: transcription,
      timestamp: new Date().toISOString(),
      isHost: true,
      channelName: activeCall.channelName
    });
  } else {
    console.warn('[Host] Socket or activeCall not available:', { socket: !!socket, activeCall });
  }
  
  setTranscriptions(prev => [...prev, {
    text: transcription,
    timestamp: new Date().toISOString(),
    isHost: true
  }]);
};
  const handleTranscriptionReceived = (newTranscription) => {
    setTranscriptions(prev => [...prev, newTranscription]);
  };
  const { transcriptionEnabled, startTranscription, stopTranscription } = 
    useTranscription({ 
      isHost: true, 
      onTranscriptionUpdate: handleTranscriptionUpdate 
    });
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
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {
          encoderConfig: {
            width: 640,
            height: 480,
            frameRate: 30,
            bitrateMin: 400,
            bitrateMax: 1000,
          }
        },
        {
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128,
          }
        }
      );
      
      setLocalTracks([audioTrack, videoTrack]);
      addDebugLog('Local tracks created');

      const localPlayer = document.getElementById('local-video-container');
      if (localPlayer && videoTrack) {
        localPlayer.innerHTML = '';
        const videoElement = document.createElement('div');
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        localPlayer.appendChild(videoElement);
        
        await videoTrack.play(videoElement, { 
          fit: 'contain',
          mirror: true
        });
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

  const leaveChannel = async () => {
    try {
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
            setError('Connection lost. Please try rejoining the call.');
            leaveChannel();
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
        leaveChannel();
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
          // Clear previous video elements
          while (remotePlayer.firstChild) {
            remotePlayer.removeChild(remotePlayer.firstChild);
          }
          
          const videoElement = document.createElement('div');
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          remotePlayer.appendChild(videoElement);
          
          // Add a small delay before playing
          await new Promise(resolve => setTimeout(resolve, 100));
          try {
            await user.videoTrack.play(videoElement, {
              fit: 'contain',
              mirror: false
            });
            addDebugLog(`Playing remote video from user ${user.uid}`);
          } catch (playError) {
            if (playError.name === 'AbortError') {
              addDebugLog('Play request aborted, retrying...');
              await new Promise(resolve => setTimeout(resolve, 500));
              await user.videoTrack.play(videoElement, {
                fit: 'contain',
                mirror: false
              });
            } else {
              throw playError;
            }
          }
        }
      }
  
      if (mediaType === 'audio') {
        try {
          await user.audioTrack.play();
          addDebugLog(`Playing remote audio from user ${user.uid}`);
        } catch (audioError) {
          addDebugLog(`Error playing audio: ${audioError.message}`);
        }
      }
  
      setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
    } catch (error) {
      addDebugLog(`Error handling user joined: ${error.message}`);
      if (clientRef.current) {
        setTimeout(() => handleUserJoined(user, mediaType), 1000);
      }
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prev => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
  };

  const addDebugLog = (message) => {
    console.log(`[Host Debug] ${message}`);
    setDebugLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

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
        const response = await fetch('https://vultr-backend-server.onrender.com/api/generate-token', {
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
        await leaveChannel();
      }
  
      const channelName = `${CHANNEL_PREFIX}${Date.now()}`;
      const token = await generateAgoraToken(channelName);
      const meetingId = Math.random().toString(36).substring(7);
      
      const encodedToken = encodeURIComponent(token);
      const fullUrl = `${window.location.origin}/join/${channelName}/${encodedToken}`;
      
      setSelectedEmail(email);
      setMeetingLink(fullUrl);
      setShowAlert(true);
      
      await joinChannel(channelName, token);
      setActiveCall({ channelName, token, meetingId });
  
      setCooldowns(prev => ({
        ...prev,
        [email]: 5
      }));
  
    } catch (error) {
      setError('Failed to generate meeting. Please try again.');
      setActiveCall(null);
    }
  };

  const toggleMic = async () => {
    if (localTracks[0]) {
      await localTracks[0].setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = async () => {
    try {
      const videoTrack = localTracks[1];
      if (videoTrack) {
        await videoTrack.setEnabled(!isCameraOn);
        
        if (!isCameraOn) {
          const localPlayer = document.getElementById('local-video-container');
          if (localPlayer) {
            localPlayer.innerHTML = '';
            const videoElement = document.createElement('div');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            localPlayer.appendChild(videoElement);
            await videoTrack.play(videoElement, { 
              fit: 'contain',
              mirror: true 
            });
          }
        }
        
        setIsCameraOn(!isCameraOn);
        addDebugLog(`Camera ${!isCameraOn ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      addDebugLog(`Error toggling camera: ${error.message}`);
      setError('Failed to toggle camera');
    }
  };
  const TranscriptionPanel = () => (
    <div className="transcription-panel">
      <div className="transcription-controls">
        <button
          onClick={transcriptionEnabled ? stopTranscription : startTranscription}
          className={`control-button ${transcriptionEnabled ? 'active' : ''}`}
        >
          {transcriptionEnabled ? 'Stop Transcription' : 'Start Transcription'}
        </button>
      </div>
      <div className="transcription-messages">
        {transcriptions.map((t, i) => {
          console.log('[TranscriptionPanel] Rendering message:', t);
          return (
            <div key={i} className={`message ${t.isHost ? 'host' : 'consumer'}`}>
              <span className="timestamp">
                {new Date(t.timestamp).toLocaleTimeString()}
              </span>
              <span className="speaker">{t.isHost ? 'Rep' : 'Consumer'}</span>
              <span className="text">
                {typeof t.text === 'object' ? t.text.text : t.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
              onClick={leaveChannel}
              disabled={!activeCall}
              className="control-button end-call"
            >
              <PhoneOff size={24} />
            </button>
          </div>
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Debug Log */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-log">
          {debugLog.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
      <TranscriptionPanel />
    </div>
    
  );
};

export default VideoConference;