// src/components/VideoCallContainer.jsx
import React, { useState } from 'react'
import JoinForm from './JoinForm'
import VideoCall from './VideoCall'

const VideoCallContainer = () => {
  const [isInCall, setIsInCall] = useState(false)
  const [currentMeetingId, setCurrentMeetingId] = useState('')

  const handleCallStart = (meetingId) => {
    setCurrentMeetingId(meetingId)
    setIsInCall(true)
  }

  const handleCallEnd = () => {
    setIsInCall(false)
    setCurrentMeetingId('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isInCall ? (
        <JoinForm onCallStart={handleCallStart} />
      ) : (
        <VideoCall 
          meetingId={currentMeetingId} 
          onCallEnd={handleCallEnd} 
        />
      )}
    </div>
  )
}

export default VideoCallContainer;