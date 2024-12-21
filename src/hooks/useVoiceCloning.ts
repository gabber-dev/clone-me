import { useState } from 'react';
import { useApi } from 'gabber-client-react';

export const useVoiceCloning = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { api } = useApi();

  const processVoiceAndCreatePersona = async (
    voiceName: string,
    personaName: string,
    description: string,
    gender: 'male' | 'female',
    audioBlob: Blob,
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Skip voice cloning and use the predefined voice ID
      const personaResponse = await api.persona.createPersona({
        name: personaName,
        description,
        gender,
        voice: '0b6c25ce-cc8d-4558-844e-4f61c00cc264', // Using the provided voice ID
      });

      return personaResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processVoiceAndCreatePersona,
    isProcessing,
    error
  };
};