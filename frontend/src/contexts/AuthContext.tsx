import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  collaboratorId?: string; // ID correspondant dans les collaborateurs du planning
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utilisateur simulé pour la démo
const mockUser: User = {
  id: 'user-1',
  name: 'Aymeric Tireau',
  email: 'aymeric.tireau@organipousse.fr',
  role: 'terrain',
  collaboratorId: 'aymeric' // Correspond à l'ID dans PlanningFiltersContext
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isAuthenticated: true
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};