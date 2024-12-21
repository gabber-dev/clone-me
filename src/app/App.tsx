"use client"
import React from 'react';
import { ApiProvider } from "gabber-client-react"
import { PersonaForm } from './components/PersonaForm';
import { Brain } from 'lucide-react';

function App(props: { usageToken: string }) {
  return (
    <ApiProvider usageToken={props.usageToken}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header section with centered text */}
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-gray-900 mb-2 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Digital Self
            </h1>
            <p className="text-gray-600 mb-8">
              Train an AI to speak just like you. Record your voice and start chatting with yourself.
            </p>
          </div>
          
          {/* Form section */}
          <div className="bg-white shadow rounded-lg p-6">
            <PersonaForm />
          </div>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;