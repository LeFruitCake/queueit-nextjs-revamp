"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Classes } from './Global_variables';

// Define the context type
interface ClassroomContextType {
  classroom: Classes | undefined;
  setClassroom: (classroom: Classes) => void;
}

// Create the context
const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

// Create a provider component
export const ClassroomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classroom, setClassroom] = useState<Classes | undefined>(() => {
    // Retrieve classroom from localStorage if available
    const storedClassroom = localStorage.getItem('classroom');
    return storedClassroom ? JSON.parse(storedClassroom) : undefined;
  });

  useEffect(() => {
    // Store classroom in localStorage whenever it changes
    if (classroom) {
      localStorage.setItem('classroom', JSON.stringify(classroom));
    } else {
      localStorage.removeItem('classroom'); // Clear if undefined
    }
  }, [classroom]);

  return (
    <ClassroomContext.Provider value={{ classroom, setClassroom }}>
      {children}
    </ClassroomContext.Provider>
  );
};

// Create a custom hook to use the ClassroomContext
export const useClassroomContext = () => {
  const context = useContext(ClassroomContext);
  if (context === undefined) {
    throw new Error('Classroom Context must be used within a ClassroomProvider');
  }
  return context;
};