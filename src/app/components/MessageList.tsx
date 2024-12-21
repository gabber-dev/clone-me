import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { useAutoScroll } from '../../hooks/useAutoScroll';

interface MessageListProps {
  messages: Array<{
    id: string;
    content: string;
    isAgent: boolean;
    timestamp: Date;
  }>;
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom, isAtBottom } = useAutoScroll(messagesEndRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};