import { useEffect, useRef, useState } from 'react';
import { 
  isElevenLabsAvailable, 
  textToSpeech, 
  playAudioBlob,
  CHILD_FRIENDLY_VOICES 
} from '../services/elevenLabsService';

/**
 * Custom hook for text-to-speech functionality
 * Supports both browser TTS and ElevenLabs API
 * @param {string} text - The text to speak
 * @param {boolean} shouldSpeak - Whether the speech should be triggered
 * @param {object} options - Speech options (rate, pitch, voice, etc.)
 * @param {boolean} options.useElevenLabs - Whether to use ElevenLabs (default: true if available)
 */
export default function useSpeech(text, shouldSpeak = false, options = {}) {
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const useElevenLabs = options.useElevenLabs !== false && isElevenLabsAvailable();

  useEffect(() => {
    // Always cancel browser TTS when starting
    synthRef.current.cancel();
    
    if (!shouldSpeak || !text) {
      return;
    }

    // Use ElevenLabs if available and not explicitly disabled
    if (useElevenLabs) {
      handleElevenLabsSpeech();
    } else {
      handleBrowserSpeech();
    }

    // Cleanup function
    return () => {
      if (useElevenLabs) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
      // Always cancel browser TTS on cleanup
      synthRef.current.cancel();
    };
  }, [text, shouldSpeak, useElevenLabs]);

  const handleElevenLabsSpeech = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audioBlob = await textToSpeech(text, {
        voiceId: options.elevenLabsVoiceId || CHILD_FRIENDLY_VOICES.CALLUM,
        stability: options.stability,
        similarityBoost: options.similarityBoost,
        style: options.style,
        useSpeakerBoost: options.useSpeakerBoost
      });

      const audio = await playAudioBlob(audioBlob);
      audioRef.current = audio;
      setIsLoading(false);
    } catch (err) {
      console.error('ElevenLabs speech error, falling back to browser TTS:', err);
      setError(err);
      setIsLoading(false);
      // Fallback to browser TTS
      handleBrowserSpeech();
    }
  };

  const handleBrowserSpeech = () => {
    // Check if speech synthesis is supported
    if (!synthRef.current) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

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
  };

  // Return control functions
  return {
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      synthRef.current.cancel(); // Always cancel browser TTS
    },
    pause: () => {
      if (useElevenLabs && audioRef.current) {
        audioRef.current.pause();
      } else {
        synthRef.current.pause();
      }
    },
    resume: () => {
      if (useElevenLabs && audioRef.current) {
        audioRef.current.play().catch(console.error);
      } else {
        synthRef.current.resume();
      }
    },
    isSpeaking: () => {
      if (useElevenLabs && audioRef.current) {
        return !audioRef.current.paused;
      }
      return synthRef.current.speaking;
    },
    isLoading,
    error,
    isUsingElevenLabs: useElevenLabs
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
