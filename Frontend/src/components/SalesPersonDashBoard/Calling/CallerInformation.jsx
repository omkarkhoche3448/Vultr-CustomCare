import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
} from "lucide-react";

const CallerInformation = ({
  activeCall,
  customerVideoSrc,
  salespersonVideoSrc,
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [volume, setVolume] = useState(50);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const audioRef = useRef(null);
  const timerRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (activeCall?.status === "Pending") {
      setIsCallActive(true);
      setCallDuration(0);
      timerRef.current = setInterval(
        () => setCallDuration((prev) => prev + 1),
        1000
      );
      setVideoOn(true);
    } else {
      setIsCallActive(false);
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [activeCall]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!activeCall) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
        <p className="text-gray-500">Select a call to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg  overflow-hidden">
      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="flex-1 grid grid-rows-2 gap-4 p-4"
      >
        {/* Customer Video */}
        <div className="relative aspect-video lg:aspect-auto lg:h-full w-full bg-gray-900 rounded-lg overflow-hidden">
          <ReactPlayer
            url={customerVideoSrc}
            playing={videoOn && isCallActive}
            muted={micMuted}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  disablePictureInPicture: true,
                },
              },
            }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1.5 rounded-lg">
            <span className="text-white font-medium">{activeCall.name}</span>
          </div>
        </div>

        {/* Salesperson Video */}
        <div className="relative aspect-video lg:aspect-auto lg:h-full w-full bg-gray-900 rounded-lg overflow-hidden">
          <ReactPlayer
            url={salespersonVideoSrc}
            playing={videoOn && isCallActive}
            muted={micMuted}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  disablePictureInPicture: true,
                },
              },
            }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1.5 rounded-lg">
            <span className="text-white font-medium">You</span>
          </div>
        </div>
      </div>

      {/* Call Info and Controls */}
      <div className=" p-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeCall.name}
          </h2>
          <p className="text-gray-600">
            {isCallActive
              ? `Duration: ${formatDuration(callDuration)}`
              : activeCall.status}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-5">
          {/* Microphone Toggle */}
          <button
            onClick={() => setMicMuted(!micMuted)}
            className={`p-3 rounded-xl transition-colors ${
              micMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            } hover:bg-opacity-80`}
            title={micMuted ? "Unmute" : "Mute"}
          >
            {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-3 rounded-xl transition-colors ${
              videoOn
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600"
            } hover:bg-opacity-80`}
            title={videoOn ? "Turn off camera" : "Turn on camera"}
          >
            {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Volume Toggle */}
          <button
            onClick={() => setVolume(volume === 0 ? 50 : 0)}
            className={`p-3 rounded-xl transition-colors ${
              volume === 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            } hover:bg-opacity-80`}
            title={`Volume: ${volume === 0 ? "Muted" : `${volume}%`}`}
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-opacity-80"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* End Call */}
          <button
            onClick={() => setIsCallActive(false)}
            className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-opacity-80"
            title="End call"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallerInformation;