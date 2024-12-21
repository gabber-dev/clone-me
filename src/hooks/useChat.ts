import { useState, useCallback } from 'react';
import { useRealtimeSessionEngine } from 'gabber-client-react';

export const useChat = () => {
  const { messages: sessionMessages, sendChatMessage } = useRealtimeSessionEngine();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    try {
      await sendChatMessage({ text: content });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sendChatMessage]);

  const messages = sessionMessages?.map(msg => ({
    id: msg.id,
    content: msg.text,
    isAgent: msg.agent,
    timestamp: new Date(msg.created_at)
  })) ?? [];

  return { messages, sendMessage, isLoading };
};