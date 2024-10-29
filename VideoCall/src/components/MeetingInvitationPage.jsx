import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MeetingInvitationPage = () => {
  const { emailid, meetingid } = useParams();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleJoinClick = () => {
    if (isAgreed) {
      window.location.href = `/user/${meetingid}/live`;
    }
  };

  return (
    <div>
      <h2>Meeting Invitation</h2>
      <label>
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
        />
        I agree that video and call is being processed for better use.
      </label>
      <button onClick={handleJoinClick} disabled={!isAgreed}>
        Join
      </button>
    </div>
  );
};

export default MeetingInvitationPage;