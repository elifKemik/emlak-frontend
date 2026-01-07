import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('token', userData.access_token);
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);