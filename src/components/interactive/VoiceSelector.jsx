import { useState, useEffect } from 'react';
import { getAvailableVoices } from '../../utils/useSpeech';

/**
 * Voice Selector Component - For testing and selecting voices
 * This component helps you find the best voice for children
 * Remove or hide this in production
 */
export default function VoiceSelector({ onVoiceSelect }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [testText] = useState("Hello! My name is Robo! What's your name?");

  useEffect(() => {
    getAvailableVoices().then(voiceList => {
      // Filter for English voices and sort by quality
      const englishVoices = voiceList.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);
    });
  }, []);

  const testVoice = (voice) => {
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const selectVoice = (voice) => {
    setSelectedVoice(voice);
    if (onVoiceSelect) {
      onVoiceSelect(voice.name);
    }
  };

  // Recommended child-friendly voices by name pattern
  const getVoiceRecommendation = (voice) => {
    const name = voice.name.toLowerCase();
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) {
      return 'Gentle';
    }
    if (name.includes('child') || name.includes('kid')) {
      return '👶 Child Voice';
    }
    if (name.includes('male') || name.includes('man') || name.includes('boy')) {
      return 'Friendly';
    }
    return '';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      right: 20,
      maxWidth: '500px',
      maxHeight: '400px',
      overflowY: 'auto',
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 9999
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
        🎤 Voice Selector (Developer Tool)
      </h3>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
        Click "Test" to hear each voice. Click "Select" to use it.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {voices.map((voice, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              background: selectedVoice?.name === voice.name ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '6px',
              fontSize: '13px'
            }}
          >
            <button
              onClick={() => testVoice(voice)}
              style={{
                padding: '4px 12px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Test
            </button>
            <button
              onClick={() => selectVoice(voice)}
              style={{
                padding: '4px 12px',
                background: selectedVoice?.name === voice.name ? '#4CAF50' : '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {selectedVoice?.name === voice.name ? '✓' : 'Select'}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{voice.name}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {voice.lang} • {getVoiceRecommendation(voice)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVoice && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#e8f5e9',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <strong>Selected:</strong> {selectedVoice.name}
          <br />
          <small>Use this voice name in your components</small>
        </div>
      )}
    </div>
  );
}
