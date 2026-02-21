import { useEffect, useRef, useState } from 'react';
import { 
  textToSpeech, 
  playAudioBlob,
  CHILD_FRIENDLY_VOICES 
} from '../services/elevenLabsService';

/**
 * Custom hook for text-to-speech functionality using ElevenLabs API
 * @param {string} text - The text to speak
 * @param {boolean} shouldSpeak - Whether the speech should be triggered
 * @param {object} options - Speech options
 */
export default function useSpeech(text, shouldSpeak = false, options = {}) {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isPlayingRef = useRef(false); // Track if audio is currently playing

  useEffect(() => {
    // If shouldSpeak is false, immediately stop any playing audio
    if (!shouldSpeak) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      isPlayingRef.current = false;
      return;
    }
    
    // If audio is already playing or loading, skip to prevent overlaps
    if (isPlayingRef.current || isLoading) {
      return;
    }
    
    if (!text) {
      return;
    }

    handleElevenLabsSpeech();

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      isPlayingRef.current = false;
    };
  }, [text, shouldSpeak]);

  const handleElevenLabsSpeech = async () => {
    try {
      setIsLoading(true);
      setError(null);
      isPlayingRef.current = true;
      
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
      
      // Clear playing flag when audio ends
      audio.addEventListener('ended', () => {
        isPlayingRef.current = false;
      });
      
      audio.addEventListener('pause', () => {
        isPlayingRef.current = false;
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('ElevenLabs speech error:', err);
      setError(err);
      setIsLoading(false);
      isPlayingRef.current = false;
    }
  };

  // Return control functions
  return {
    stop: () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        } catch (e) {
          console.warn('Error stopping audio:', e);
        }
      }
      isPlayingRef.current = false;
      setIsLoading(false);
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
    resume: () => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    },
    isSpeaking: () => {
      return audioRef.current && !audioRef.current.paused;
    },
    isLoading,
    error
  };
}
