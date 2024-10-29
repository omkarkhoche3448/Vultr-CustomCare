// src/components/VideoCall.jsx
import React, { useState, useEffect } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import VideoPlayer from './VideoPlayer'

const APP_ID = '0d93673aec684720b9126be9fbd575ae'

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
})

const VideoCall = ({ meetingId, onCallEnd }) => {
  const [localTracks, setLocalTracks] = useState([])
  const [remoteUsers, setRemoteUsers] = useState({})

  useEffect(() => {
    let mounted = true

    const initializeCall = async () => {
      client.on('user-published', handleUserPublished)
      client.on('user-unpublished', handleUserUnpublished)

      try {
        // Join the channel
        await client.join(APP_ID, meetingId, null, null)

        // Check user count
        const userCount = Object.keys(remoteUsers).length
        if (userCount >= 2) {
          alert('Meeting is full!')
          await client.leave()
          onCallEnd()
          return
        }

        // Create and publish local tracks
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
          {
            encoderConfig: {
              width: 640,
              height: 360,
              frameRate: 30,
              bitrateMin: 400,
              bitrateMax: 800,
            }
          },
          {
            AEC: true,
            AGC: true,
            ANS: true
          }
        )

        if (mounted) {
          setLocalTracks([audioTrack, videoTrack])
          await client.publish([audioTrack, videoTrack])
        }

      } catch (error) {
        console.error('Error joining call:', error)
        if (mounted) {
          onCallEnd()
        }
      }
    }

    initializeCall()

    return () => {
      mounted = false
      // Cleanup
      localTracks.forEach(track => {
        try {
          track.stop()
          track.close()
        } catch (err) {
          console.error('Error closing track:', err)
        }
      })
      client.removeAllListeners()
      client.leave()
    }
  }, [meetingId])

  const handleUserPublished = async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType)

      if (mediaType === 'video') {
        setRemoteUsers(prev => ({
          ...prev,
          [user.uid]: user
        }))
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play()
      }
    } catch (err) {
      console.error('Error handling published user:', err)
    }
  }

  const handleUserUnpublished = (user) => {
    setRemoteUsers(prev => {
      const newUsers = { ...prev }
      delete newUsers[user.uid]
      return newUsers
    })
  }

  const handleLeaveCall = async () => {
    try {
      localTracks.forEach(track => {
        track.stop()
        track.close()
      })
      await client.leave()
      onCallEnd()
    } catch (err) {
      console.error('Error leaving call:', err)
      onCallEnd()
    }
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local Video */}
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
          {localTracks[1] && (
            <>
              <VideoPlayer track={localTracks[1]} />
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                You
              </div>
            </>
          )}
        </div>
        
        {/* Remote Videos */}
        {Object.values(remoteUsers).map((user) => (
          <div key={user.uid} className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            <VideoPlayer track={user.videoTrack} />
            <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              User {user.uid}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleLeaveCall}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center"
        >
          Leave Call
        </button>
      </div>
    </div>
  )
}

export default VideoCall;