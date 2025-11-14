import { useEffect, useRef } from 'react';

/**
 * Custom hook for text-to-speech functionality
 * @param {string} text - The text to speak
 * @param {boolean} shouldSpeak - Whether the speech should be triggered
 * @param {object} options - Speech options (rate, pitch, voice, etc.)
 */
export default function useSpeech(text, shouldSpeak = false, options = {}) {
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!synthRef.current) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    if (shouldSpeak && text) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      
      // Set voice options
      utteranceRef.current.rate = options.rate || 1.0; // Speed (0.1 to 10)
      utteranceRef.current.pitch = options.pitch || 1.0; // Pitch (0 to 2)
      utteranceRef.current.volume = options.volume || 1.0; // Volume (0 to 1)
      
      // Set voice if specified
      if (options.voiceName) {
        const voices = synthRef.current.getVoices();
        const selectedVoice = voices.find(voice => voice.name === options.voiceName);
        if (selectedVoice) {
          utteranceRef.current.voice = selectedVoice;
        }
      }

      // Speak the text
      synthRef.current.speak(utteranceRef.current);
    }

    // Cleanup function
    return () => {
      synthRef.current.cancel();
    };
  }, [text, shouldSpeak, options.rate, options.pitch, options.volume, options.voiceName]);

  // Return control functions
  return {
    stop: () => synthRef.current.cancel(),
    pause: () => synthRef.current.pause(),
    resume: () => synthRef.current.resume(),
    isSpeaking: () => synthRef.current.speaking,
  };
}

/**
 * Utility function to get available voices
 */
export function getAvailableVoices() {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length) {
      resolve(voices);
    } else {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

/**
 * Get a child-friendly voice automatically
 * Prefers female voices as they're generally perceived as warmer and friendlier
 */
export async function getChildFriendlyVoice() {
  const voices = await getAvailableVoices();
  
  // Priority order for child-friendly voices
  const priorities = [
    // Look for explicitly child/young voices
    (v) => v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('kid'),
    // Look for female voices (generally warmer)
    (v) => (v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('girl')) && v.lang.startsWith('en'),
    // Look for any English voice marked as local (usually higher quality)
    (v) => v.lang.startsWith('en') && v.localService,
    // Fallback to any English voice
    (v) => v.lang.startsWith('en')
  ];

  for (const priority of priorities) {
    const voice = voices.find(priority);
    if (voice) return voice;
  }

  return null; // Use default browser voice
}
