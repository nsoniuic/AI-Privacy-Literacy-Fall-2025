import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * ElevenLabs Text-to-Speech Service
 * Provides high-quality AI voice synthesis
 */

let elevenLabsClient = null;

/**
 * Initialize the ElevenLabs client with API key
 * @param {string} apiKey - Your ElevenLabs API key
 */
export function initializeElevenLabs(apiKey) {
  if (!apiKey) {
    console.warn('ElevenLabs API key not provided. TTS will fall back to browser default.');
    return false;
  }
  
  try {
    elevenLabsClient = new ElevenLabsClient({
      apiKey: apiKey
    });
    return true;
  } catch (error) {
    console.error('Failed to initialize ElevenLabs:', error);
    return false;
  }
}

/**
 * Check if ElevenLabs is initialized and ready
 */
export function isElevenLabsAvailable() {
  return elevenLabsClient !== null;
}

/**
 * Convert text to speech using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {object} options - Voice options
 * @returns {Promise<AudioBuffer>} - Audio buffer that can be played
 */
export async function textToSpeech(text, options = {}) {
  if (!elevenLabsClient) {
    throw new Error('ElevenLabs client not initialized');
  }

  try {
    // Default to a child-friendly voice
    const voiceId = options.voiceId || "CwhRBWXzGAHq8TQ4Fs17"; // Callum - warm, middle-aged male voice
    
    const audioStream = await elevenLabsClient.textToSpeech.convert(voiceId, {
      text: text,
      model_id: options.modelId || "eleven_multilingual_v2",
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarityBoost || 0.75,
        style: options.style || 0.0,
        use_speaker_boost: options.useSpeakerBoost !== undefined ? options.useSpeakerBoost : true
      }
    });

    // Convert stream to audio buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    
    const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
    return audioBlob;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

/**
 * Get available ElevenLabs voices
 * @returns {Promise<Array>} - List of available voices
 */
export async function getElevenLabsVoices() {
  if (!elevenLabsClient) {
    throw new Error('ElevenLabs client not initialized');
  }

  try {
    const response = await elevenLabsClient.voices.getAll();
    return response.voices || [];
  } catch (error) {
    console.error('Failed to fetch ElevenLabs voices:', error);
    return [];
  }
}

/**
 * Recommended child-friendly voices with their IDs
 * These are warm, clear, and appropriate for children
 */
export const CHILD_FRIENDLY_VOICES = {
  // Child voices
  LILY: "pFZP5JQG7iQjIQuC4Bku", // Young girl voice - bright and cheerful
  DOROTHY: "ThT5KcBeYPX3keUQqHPh", // Young child voice - playful and energetic
  
  // Male voices
  CALLUM: "CwhRBWXzGAHq8TQ4Fs17", // Warm, middle-aged male voice (default robot)
  JOSH: "TxGEqnHWrfWFTfGW9XjX", // Young, engaging male voice
  ADAM: "pNInz6obpgDQGcFmaJgB", // Deep, resonant male voice
  CHARLIE: "IKne3meq5aSn9XLyUdCD", // Casual, conversational male voice
  
  // Female voices
  ARIA: "pMsXgVXv3BLzUgSXRplE", // Warm, friendly female voice
  SARAH: "EXAVITQu4vr4xnSDxMaL", // Soft, gentle female voice
  GRACE: "oWAxZDx7w5VEj9dCyTzz", // Clear, engaging female voice
  NICOLE: "piTKgcLEGmPE4e6mEKli", // Bright, cheerful female voice
};

/**
 * Play audio from a blob
 * @param {Blob} audioBlob - The audio blob to play
 * @returns {Promise<HTMLAudioElement>} - The audio element
 */
export function playAudioBlob(audioBlob) {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve(audio);
    };
    
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };
    
    audio.play().catch(reject);
  });
}
