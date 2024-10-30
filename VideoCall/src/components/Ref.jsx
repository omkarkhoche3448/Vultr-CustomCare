import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, PhoneOff, Send, Timer, Copy, Check } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { Alert, AlertDescription } from './Alert';
import './VideoConference.css';

const VideoConference = () => {
  // ... (keep existing state and constants)

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

      // Ensure container exists before playing
      const localPlayer = document.getElementById('local-video-container');
      if (localPlayer && videoTrack) {
        // Clear any existing content
        localPlayer.innerHTML = '';
        // Create a new container for the video
        const videoElement = document.createElement('div');
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        localPlayer.appendChild(videoElement);
        
        // Play video with optimization options
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
          // Clear existing content
          remotePlayer.innerHTML = '';
          // Create new container for video
          const videoElement = document.createElement('div');
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          remotePlayer.appendChild(videoElement);
          
          // Play video with optimization options
          await user.videoTrack.play(videoElement, {
            fit: 'contain',
            mirror: false
          });
          addDebugLog(`Playing remote video from user ${user.uid}`);
        }
      }

      if (mediaType === 'audio') {
        await user.audioTrack.play();
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



  // ... (rest of the component remains the same)
};

export default VideoConference;