import React from 'react';
import { Brain } from 'lucide-react';
import { AgentAudioVisualizer } from './AgentAudioVisualizer';

interface ChatHeaderProps {
  persona: {
    name: string;
    imageUrl?: string;
  };
}

export const ChatHeader = ({ persona }: ChatHeaderProps) => {
  return (
    <div className="flex items-center p-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        {persona.imageUrl ? (
          <img 
            src={persona.imageUrl} 
            alt={persona.name} 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <Brain className="w-10 h-10 text-blue-500" />
        )}
        <div>
          <h3 className="font-semibold">{persona.name}</h3>
          <AgentAudioVisualizer />
        </div>
      </div>
    </div>
  );
};