"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Meeting, MeetingBoardHistoryEntry } from '../Utils/Global_variables';

// Define the context type
interface MeetingsContextType {
  Meetings: Array<MeetingBoardHistoryEntry> | undefined;
  setMeetings: (Meetings: Array<MeetingBoardHistoryEntry> | undefined) => void;
}

// Create the context
const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

// Create a provider component
export const MeetingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Meetings, setMeetings] = useState<Array<MeetingBoardHistoryEntry> | undefined>(() => {
    // Retrieve Meetings from localStorage if available
    const storedMeetings = localStorage.getItem('Meetings');
    return storedMeetings ? JSON.parse(storedMeetings) : undefined;
  });

  useEffect(() => {
    // Store Meetings in localStorage whenever it changes
    if (Meetings) {
      // const MeetingsWithMembers = {...Meetings, members:Array.from(Meetings.members)}
      localStorage.setItem('Meetings', JSON.stringify(Meetings));
    } else {
      localStorage.removeItem('Meetings'); // Clear if undefined
    }
  }, [Meetings]);

  return (
    <MeetingsContext.Provider value={{ Meetings, setMeetings }}>
      {children}
    </MeetingsContext.Provider>
  );
};

// Create a custom hook to use the MeetingsContext
export const useMeetingsContext = () => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('Meetings Context must be used within a MeetingsProvider');
  }
  return context;
};