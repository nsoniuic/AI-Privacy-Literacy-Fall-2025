import React, { createContext, useContext, useState, useEffect } from 'react';
import { getChildFriendlyVoice } from '../utils/useSpeech';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [friendlyVoice, setFriendlyVoice] = useState(null);

  // Load child-friendly voice on mount
  useEffect(() => {
    getChildFriendlyVoice().then(voice => {
      setFriendlyVoice(voice);
    });
  }, []);

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
  };

  const value = {
    voiceEnabled,
    friendlyVoice,
    toggleVoice,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
