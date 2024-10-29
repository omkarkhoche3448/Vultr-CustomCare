// src/components/JoinForm.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const JoinForm = ({ onCallStart }) => {
  const [meetingId, setMeetingId] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const meetingFromUrl = searchParams.get('meeting')
    if (meetingFromUrl) {
      setMeetingId(meetingFromUrl)
    }
  }, [searchParams])

  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const createMeeting = () => {
    const newMeetingId = generateMeetingId()
    const meetingUrl = `${window.location.origin}?meeting=${newMeetingId}`
    alert(`Share this URL to invite others:\n${meetingUrl}`)
    navigate(`?meeting=${newMeetingId}`)
    onCallStart(newMeetingId)
  }

  const joinMeeting = () => {
    if (!meetingId) {
      alert('Please enter a meeting ID')
      return
    }
    onCallStart(meetingId)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Join Meeting</h1>
      <button
        onClick={createMeeting}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
      >
        Create New Meeting
      </button>
      <div className="mt-4">
        <input
          type="text"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          placeholder="Enter meeting ID"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={joinMeeting}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Join Meeting
        </button>
      </div>
    </div>
  )
}

export default JoinForm