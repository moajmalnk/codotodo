import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [dueDate, setDueDate] = useState('all');

  return (
    <GlobalContext.Provider value={{
      searchTerm,
      setSearchTerm,
      priority,
      setPriority,
      status,
      setStatus,
      dueDate,
      setDueDate,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};