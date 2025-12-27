
import { TranscriptionResponse } from '../types';

export async function transcribeAudio(audioBlob: Blob, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('model', 'TeleAI/TeleSpeechASR');
  // API expects a file. Create a file from blob.
  const file = new File([audioBlob], 'recording.wav', { type: audioBlob.type });
  formData.append('file', file);

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'STT API request failed');
    }

    const data: TranscriptionResponse = await response.json();
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
