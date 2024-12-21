import React, { useState } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { useRealtimeSessionEngine } from 'gabber-client-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { 
    sendChatMessage, 
    isRecording, 
    setMicrophoneEnabled, 
    microphoneEnabled, 
    startAudio 
  } = useRealtimeSessionEngine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await sendChatMessage({ text: message });
        onSendMessage(message);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const toggleMicrophone = async () => {
    try {
      if (!microphoneEnabled) {
        await startAudio();
      }
      setMicrophoneEnabled(!microphoneEnabled);
    } catch (error) {
      console.error('Error toggling microphone:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={toggleMicrophone}
          className={`p-2 rounded-full transition-colors ${
            microphoneEnabled 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {microphoneEnabled ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={microphoneEnabled ? "Listening..." : "Type a message..."}
          disabled={microphoneEnabled}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900"
        />
        
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Recording...</span>
        </div>
      )}
    </form>
  );
};