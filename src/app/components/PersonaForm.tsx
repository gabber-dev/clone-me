import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceRecorder } from './VoiceRecorder';
import { useVoiceCloning } from '@/hooks/useVoiceCloning';

interface PersonaFormData {
  name: string;
  description: string;
  gender: 'male' | 'female';
}

export const PersonaForm = () => {
  const router = useRouter();
  const { processVoiceAndCreatePersona, isProcessing, error } = useVoiceCloning();
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    description: '',
    gender: 'male'
  });
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioBlob) {
      alert('Please record audio first');
      return;
    }

    try {
      const persona = await processVoiceAndCreatePersona(
        formData.name, // Use same name for voice and persona
        formData.name,
        formData.description,
        formData.gender,
        audioBlob
      );

      // Reset form
      setFormData({ name: '', description: '', gender: 'male' });
      setAudioBlob(null);
      
      // Navigate to chat with the new persona
      router.push(`/chat/${persona.data.id}`);
    } catch (err) {
      console.error('Error creating digital self:', err);
      // Error will be handled by the useVoiceCloning hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name your digital self
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Describe their personality
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Record your voice (30 seconds)
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Please read the following text clearly:
          &quot;The quick brown fox jumps over the lazy dog. I&apos;m recording this sample to create my digital voice clone.&quot;
        </p>
        <VoiceRecorder onAudioRecorded={handleAudioRecorded} />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !audioBlob}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Creating...' : 'Create My Digital Self'}
      </button>
    </form>
  );
};
