import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import lamejs from 'lamejs';

interface LameJs {
  Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => Mp3Encoder;
}

declare class Mp3Encoder {
  encodeBuffer(buffer: Int16Array): Uint8Array;
  flush(): Uint8Array;
}

declare module 'lamejs' {
  const content: LameJs;
  export default content;
}

interface VoiceRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const mp3EncoderRef = useRef<lamejs.Mp3Encoder | null>(null);
  const mp3DataRef = useRef<Uint8Array[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      audioContextRef.current = new AudioContext();
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorNodeRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      mp3EncoderRef.current = new lamejs.Mp3Encoder(1, 44100, 128);
      mp3DataRef.current = [];

      processorNodeRef.current.onaudioprocess = (e) => {
        const samples = e.inputBuffer.getChannelData(0);
        const sampleSize = samples.length;
        const int16Samples = new Int16Array(sampleSize);

        for (let i = 0; i < sampleSize; i++) {
          // Scale to 16-bit range and clamp
          const s = Math.max(-1, Math.min(1, samples[i]));
          int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const mp3Data = mp3EncoderRef.current!.encodeBuffer(int16Samples);
        if (mp3Data.length > 0) {
          mp3DataRef.current.push(mp3Data);
        }
      };

      sourceNodeRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContextRef.current.destination);

      setIsRecording(true);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (processorNodeRef.current && sourceNodeRef.current) {
      // Stop recording
      sourceNodeRef.current.disconnect();
      processorNodeRef.current.disconnect();
      
      // Get the final MP3 data
      const finalMp3Data = mp3EncoderRef.current!.flush();
      if (finalMp3Data.length > 0) {
        mp3DataRef.current.push(finalMp3Data);
      }

      // Combine all MP3 chunks
      const blob = new Blob(mp3DataRef.current, { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      onAudioRecorded(blob);

      // Cleanup
      setIsRecording(false);
      audioContextRef.current?.close();
      mp3DataRef.current = [];
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      onAudioRecorded(new Blob());
    }
  };

  // Rest of the component remains the same
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}
        {audioURL && (
          <div className="flex items-center gap-2">
            <audio controls src={audioURL} className="h-10" />
            <button
              onClick={deleteRecording}
              className="p-2 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Recording... (max 30 seconds)</span>
        </div>
      )}
    </div>
  );
}; 