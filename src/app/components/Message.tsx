import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';

interface MessageProps {
  message: {
    content: string;
    isAgent: boolean;
    timestamp: Date;
  };
}

export const Message = ({ message }: MessageProps) => {
  const { content, isAgent, timestamp } = message;
  
  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isAgent
            ? 'bg-white text-gray-800'
            : 'bg-blue-500 text-white'
        }`}
      >
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
    </div>
  );
};