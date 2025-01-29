"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Classes, UserType } from './Global_variables';

// Define the context type
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}


const faculty:User ={
    uid:1,
    firstname:"jasmine",
    lastname:"tulin",
    email:"jasmine.tulin@cit.edu",
    password:"test",
    role:UserType.FACULTY,
    isDeleted:false,
    interests:"Videogames",
    enrolledClasses:new Set()
}

const classroom1:Classes ={
    cid:1,
    createdBy:faculty,
    courseType:"Project based",
    courseCode:"ZXC",
    section:"G01",
    schoolYear:"2425",
    semester:"2",
    courseDescription:"Capstone",
    classKey:"ZXC",
    createdDate: new Date(),
    isDeleted:false
}

const classes = new Set()
classes.add(classroom1)


const student:User ={
    uid:1,
    firstname:"jandel",
    lastname:"macabecha",
    email:"jandel.macabecha@cit.edu",
    password:"test",
    role:UserType.STUDENT,
    isDeleted:false,
    interests:"Videogames",
    enrolledClasses: classes as Set<Classes>
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser ] = useState<User | null>(student);

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