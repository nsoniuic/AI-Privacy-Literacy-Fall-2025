const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    
    const client = new TextToSpeechClient({
      credentials: credentials
    });

    const { text, voiceName } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const request = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceName || 'en-US-', // Child-friendly female voice
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        // pitch: 1.0,
        volumeGainDb: 0.0
      }
    };

    const [response] = await client.synthesizeSpeech(request);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', response.audioContent.length);
    res.status(200).send(response.audioContent);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ 
      error: 'Text-to-speech synthesis failed',
      details: error.message 
    });
  }
}
