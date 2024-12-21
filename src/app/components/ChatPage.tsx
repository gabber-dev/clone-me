"use client"
import { ApiProvider, RealtimeSessionEngineProvider, useRealtimeSessionEngine } from "gabber-client-react";
import { ChatContainer } from "./ChatContainer";

interface Persona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  voiceId: string;
}

interface ChatPageProps {
  personaId: string;
  persona: Persona;
  usageToken: string;
}

function ChatPageContent({ persona }: { persona: Persona }) {
    const { sendChatMessage, isRecording } = useRealtimeSessionEngine();
    return <ChatContainer persona={persona} />;
}

const SFW_LLM = "21892bb9-9809-4b6f-8c3e-e40093069f04"

export function ChatPage({ persona, usageToken }: ChatPageProps) {
  return (
    <RealtimeSessionEngineProvider connectionOpts={{
        token: usageToken,
        config: {
            generative: {
                persona: persona.id,
                scenario: "adf72b21-2c7e-418f-89b6-192431ca6c2f",
                llm: SFW_LLM
            },
            general: {},
            input: { interruptable: true, parallel_listening: true },
            output: {
                stream_transcript: true,
                speech_synthesis_enabled: true
            }
        },
      }}>
      <ApiProvider usageToken={usageToken}>
        <ChatPageContent persona={persona} />
      </ApiProvider>
    </RealtimeSessionEngineProvider>
  );
} 