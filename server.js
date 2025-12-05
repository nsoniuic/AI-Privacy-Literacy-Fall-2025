import express from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Cloud TTS client
const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

app.post('/api/synthesize', async (req, res) => {
  try {
    const { text, voiceName, languageCode } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Synthesizing text:', text.substring(0, 50) + '...');

    const request = {
      input: { text },
      voice: {
        languageCode: languageCode || 'en-US',
        name: voiceName || 'en-US-Journey-F', // More natural Journey voice
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,  // Normal speed for natural flow
        volumeGainDb: 0.0,
        effectsProfileId: ['small-bluetooth-speaker-class-device']  // Optimize for clarity
      }
    };

    const [response] = await client.synthesizeSpeech(request);
    
    console.log('Audio generated successfully');
    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ 
      error: 'Text-to-speech synthesis failed',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TTS Server' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TTS Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/synthesize`);
});
