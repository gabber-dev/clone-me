import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';

interface Persona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  voiceId: string;
}

interface ChatContainerProps {
  persona: Persona;
}

export const ChatContainer = ({ persona }: ChatContainerProps) => {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader persona={{
        name: persona.name,
        imageUrl: undefined
      }} />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};