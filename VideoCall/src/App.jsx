import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VideoConference from './components/VideoConference';
import ConsumerView from './components/ConsumerView';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Sales Representative Dashboard */}
        
        <Route path="/dashboard" element={<VideoConference />} />
        
        {/* Consumer Meeting View - Modified to handle long tokens */}
        // App.jsx

  {/* Update the join route to include meetingId */}
  <Route path="/join/:channelName/:token/:meetingId" element={<ConsumerView />} />

        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;