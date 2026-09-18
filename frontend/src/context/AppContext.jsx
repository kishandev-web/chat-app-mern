import React, { createContext, useContext, useState, useEffect } from 'react';
import { chats as initialChats, users } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [chats, setChats] = useState(initialChats);
  const [currentUser] = useState({
    id: 'me',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1776715139302-281f91c0c9ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDYxfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D',
    phone: '+1 234 567 890',
    about: 'Available',
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider value={{
      activeChat,
      setActiveChat,
      theme,
      toggleTheme,
      currentUser,
      chats,
      setChats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
