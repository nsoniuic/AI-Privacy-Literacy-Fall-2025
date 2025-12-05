import { useEffect, useRef, useState } from 'react';

export default function useSpeech(text, shouldSpeak, options = {}) {
  const audioRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!shouldSpeak || !text) {
      stop();
      return;
    }

    const speak = async () => {
      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        setIsSpeaking(true);

        const response = await fetch('http://localhost:3001/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: options.voiceName || 'en-US-Journey-F',
            languageCode: 'en-US'
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) throw new Error('TTS failed');

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop existing audio
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audioRef.current.play();
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('TTS Error:', error);
        }
        setIsSpeaking(false);
      }
    };

    speak();

    return () => {
      stop();
    };
  }, [text, shouldSpeak, options.voiceName]);

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return {
    stop,
    pause,
    resume,
    isSpeaking: () => isSpeaking
  };
}

// For Google Cloud TTS, we don't need to select voices like Web Speech API
// Instead, we'll return a mock voice object with the voice name
export async function getChildFriendlyVoice() {
  // Return the child-friendly Google Cloud TTS voice (Journey is most natural)
  return {
    name: 'en-US-Journey-D',
    label: 'Google Cloud Journey Voice (Most Natural)'
  };
}