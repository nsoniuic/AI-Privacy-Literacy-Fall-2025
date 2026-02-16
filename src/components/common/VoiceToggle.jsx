import React, { useState, useEffect } from 'react';
import { useVoice } from '../../contexts/VoiceContext';

const VoiceToggle = () => {
  const { voiceEnabled, toggleVoice } = useVoice();
  const [showHint, setShowHint] = useState(true);

  const handleClick = () => {
    setShowHint(false);
    toggleVoice();
  };

  return (
    <div className="voice-toggle-container">
      <button 
        className="voice-toggle-button" 
        onClick={handleClick}
        aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
        title={voiceEnabled ? 'Voice On' : 'Voice Off'}
      >
        {voiceEnabled ? '🔊' : '🔇'}
      </button>
      {showHint && !voiceEnabled && (
        <div className="voice-hint">
          Click for audio
        </div>
      )}
    </div>
  );
};

export default VoiceToggle;
