import { useState, useCallback } from 'react';

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    // Handle voice recording logic
  }, []);

  return {
    isRecording,
    toggleRecording,
    voiceText
  };
};