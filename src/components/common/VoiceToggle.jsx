import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';

const VoiceToggle = () => {
  const { voiceEnabled, toggleVoice } = useVoice();

  return (
    <button 
      className="voice-toggle-button" 
      onClick={toggleVoice}
      aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
      title={voiceEnabled ? 'Voice On' : 'Voice Off'}
    >
      {voiceEnabled ? '🔊' : '🔇'}
    </button>
  );
};

export default VoiceToggle;
