import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, PhoneOff, Send, Timer, Copy, Check } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
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
  ];

  // Core states
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

  const clientRef = useRef(null);

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
      if (!clientRef.current) {
        throw new Error('Agora client not initialized');
      }

      const hostUid = 1000;
      await clientRef.current.join(APP_ID, channelName, token, hostUid);

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([audioTrack, videoTrack]);

      const localPlayer = document.getElementById('local-video-container');
      if (localPlayer && videoTrack) {
        localPlayer.innerHTML = '';
        const videoElement = document.createElement('div');
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        localPlayer.appendChild(videoElement);
        await videoTrack.play(videoElement, { fit: 'contain', mirror: true });
      }

      await clientRef.current.publish([audioTrack, videoTrack]);
      setConnectionState('CONNECTED');
      setError(null);

      return { audioTrack, videoTrack };
    } catch (error) {
      throw error;
    }
  };

  const leaveAndRemoveLocalStream = async () => {
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
          if (curState === 'DISCONNECTED') {
            setError('Connection lost. Please try rejoining the call.');
            leaveAndRemoveLocalStream();
          }
        });

        agoraClient.on('user-published', handleUserJoined);
        agoraClient.on('user-left', handleUserLeft);
        
        setClient(agoraClient);
      } catch (error) {
        setError('Failed to initialize video conference system');
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
    try {
      if (!clientRef.current) return;
      
      await clientRef.current.subscribe(user, mediaType);

      if (mediaType === 'video') {
        const remotePlayer = document.getElementById('remote-video-container');
        if (remotePlayer) {
          remotePlayer.innerHTML = '';
          const videoElement = document.createElement('div');
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          remotePlayer.appendChild(videoElement);
          await user.videoTrack.play(videoElement, { fit: 'contain', mirror: false });
        }
      }

      if (mediaType === 'audio') {
        await user.audioTrack.play();
      }

      setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
    } catch (error) {
      setTimeout(() => {
        if (clientRef.current) {
          handleUserJoined(user, mediaType);
        }
      }, 1000);
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prev => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
  };

  const generateAgoraToken = async (channelName) => {
    try {
      const response = await fetch('https://vultr-backend-server.onrender.com/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName,
          role: 'publisher',
          appId: APP_ID,
          appCertificate: '33f9a027a70f48bab96ba233ea13781f',
          uid: 0,
        }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const { token } = await response.json();
      return token;
    } catch (error) {
      throw error;
    }
  };

  const generateMeetingLink = async (email) => {
    try {
      if (activeCall) {
        await leaveAndRemoveLocalStream();
      }

      const channelName = `${CHANNEL_PREFIX}${Date.now()}`;
      const token = await generateAgoraToken(channelName);
      const meetingId = Math.random().toString(36).substring(7);
      const fullUrl = `${window.location.origin}/join/${channelName}/${token}/${meetingId}`;
      
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
        setIsCameraOn(!isCameraOn);
      }
    } catch (error) {
      setError('Failed to toggle camera');
    }
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
    return () => Object.values(timers).forEach(timer => clearInterval(timer));
  }, [cooldowns]);

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

      {/* Right Column - Empty Section */}
      <div className="transcription-section">
        <div className="transcription-content">
          <div className="empty-state">
            Transcription Feature Disabled
          </div>
        </div>
      </div>

      {/* Meeting Link Alert Modal */}
      {showAlert && (
        <div className="meeting-link-modal">
          <div className="modal-header">
            <h3 className="modal-title">Meeting Link</h3>
            <button onClick={() => setShowAlert(false)} className="close-button">
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
    </div>
  );
};

export default VideoConference;