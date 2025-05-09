import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [dueDate, setDueDate] = useState('all');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      isPrivacyMode,
      setIsPrivacyMode,
      snackbar,
      setSnackbar,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}; 