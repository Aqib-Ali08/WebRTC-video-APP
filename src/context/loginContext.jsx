import React, { createContext, useContext, useState } from 'react';

// Create a context for login state
const LoginContext = createContext();

// Custom hook to use LoginContext
export const useLogin = () => {
  return useContext(LoginContext);
};

// LoginProvider to wrap the app and provide login state
export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Tracks logged-in user
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Authentication status

  // Function to handle login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <LoginContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
