import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { seedDemoRequests, getUserRequests } from '@/data/requests/mockRequests';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo purposes, start with a logged-in user
  // In production, this would check for stored auth tokens
  const [user, setUser] = useState<User | null>({
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@company.com'
  });

  // Seed demo data on mount if user is logged in and has no requests
  useEffect(() => {
    if (user) {
      const existingRequests = getUserRequests(user.id);
      if (existingRequests.length === 0) {
        seedDemoRequests(user.id);
      }
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any credentials
    const newUser = {
      id: 'user-123',
      name: 'John Doe',
      email: email
    };
    setUser(newUser);
    
    // Seed demo data for new user
    const existingRequests = getUserRequests(newUser.id);
    if (existingRequests.length === 0) {
      seedDemoRequests(newUser.id);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
