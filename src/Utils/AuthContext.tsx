"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  // Initialize user state from localStorage if available
  // const [user, setUser ] = useState<User | null>(() => {
  //   const storedUser  = localStorage.getItem('user');
  //   return storedUser  ? JSON.parse(storedUser ) : faculty; // Parse the stored user or return default student
  // });
  // const [user, setUser ] = useState<User | null>(faculty);
  const [user, setUser ] = useState<User | null>(student);
  // const [user, setUser ] = useState<User | null>(user2);

  const login = (userData: User) => {
    setUser (userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
  };

  const logout = () => {
    setUser (null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  // Sync user state with localStorage on change
  useEffect(() => {
    if (user) {
      const userWithClasses = {...user, enrolledClasses: Array.from(user.enrolledClasses)}
      localStorage.setItem('user',JSON.stringify(userWithClasses))
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

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
    throw new Error('useUser  Context must be used within a UserProvider');
  }
  return context;
};