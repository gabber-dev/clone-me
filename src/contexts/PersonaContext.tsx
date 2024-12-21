import React, { createContext, useContext, useState, useEffect } from 'react';

interface Persona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  voiceId: string;
}

interface PersonaContextType {
  personas: Persona[];
  addPersona: (persona: Persona) => void;
  getPersona: (id: string) => Persona | undefined;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personas, setPersonas] = useState<Persona[]>(() => {
    // Load personas from localStorage on init
    const saved = localStorage.getItem('personas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Save personas to localStorage whenever they change
    localStorage.setItem('personas', JSON.stringify(personas));
  }, [personas]);

  const addPersona = (persona: Persona) => {
    setPersonas(prev => [...prev, persona]);
  };

  const getPersona = (id: string) => {
    return personas.find(p => p.id === id);
  };

  return (
    <PersonaContext.Provider value={{ personas, addPersona, getPersona }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersonas = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersonas must be used within a PersonaProvider');
  }
  return context;
};
