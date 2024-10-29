// src/components/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({ track }) => {
  const ref = useRef(null)

  useEffect(() => {
    const div = ref.current
    if (!div || !track) return

    const startPlay = async () => {
      try {
        // Wait for track to be ready
        await track.setEnabled(true)
        await track.play(div, { fit: 'cover' })
      } catch (err) {
        console.error('Error playing track:', err)
      }
    }

    startPlay()

    return () => {
      try {
        track?.stop()
      } catch (err) {
        console.error('Error stopping track:', err)
      }
    }
  }, [track])

  return (
    <div ref={ref} className="w-full h-full bg-black" />
  )
}

export default VideoPlayer;