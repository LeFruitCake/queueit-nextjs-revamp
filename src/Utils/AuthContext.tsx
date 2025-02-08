"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './Global_variables';
import { faculty, student, user2 } from '@/Sample_Data/SampleData1';

// Define the context type
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [user, setUser ] = useState<User | null>(student);
  const [user, setUser ] = useState<User | null>(user2);
  // const [user, setUser ] = useState<User | null>(faculty);

  const login = (userData: User) => {
    setUser (userData);
  };

  const logout = () => {
    setUser (null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser Context must be used within a UserProvider');
  }
  return context;
};