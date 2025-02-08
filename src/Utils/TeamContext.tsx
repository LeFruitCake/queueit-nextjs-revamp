"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Team } from './Global_variables';

// Define the context type
interface TeamContextType {
  Team: Team | undefined;
  setTeam: (Team: Team) => void;
}

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Create a provider component
export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Team, setTeam] = useState<Team | undefined>(() => {
    // Retrieve Team from localStorage if available
    const storedTeam = localStorage.getItem('Team');
    return storedTeam ? JSON.parse(storedTeam) : undefined;
  });

  useEffect(() => {
    // Store Team in localStorage whenever it changes
    if (Team) {
      localStorage.setItem('Team', JSON.stringify(Team));
    } else {
      localStorage.removeItem('Team'); // Clear if undefined
    }
  }, [Team]);

  return (
    <TeamContext.Provider value={{ Team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

// Create a custom hook to use the TeamContext
export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('Team Context must be used within a TeamProvider');
  }
  return context;
};