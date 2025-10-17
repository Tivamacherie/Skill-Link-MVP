import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock User Profile Type
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  skills: string[];
  wantToLearn: string[];
  bio: string;
  createdAt: Date;
  lastSeen: Date;
  isOnline: boolean;
}

// Mock User Type (simplified)
interface MockUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: MockUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for testing
const MOCK_USERS = [
  {
    uid: '1',
    email: 'martin@test.com',
    password: '123456',
    displayName: 'Martin',
    profile: {
      uid: '1',
      email: 'martin@test.com',
      displayName: 'Martin',
      skills: ['English', 'Writing', 'Communication'],
      wantToLearn: ['Guitar', 'Music Theory', 'Piano'],
      bio: 'Native English speaker with 5 years of teaching experience. Love helping people improve their communication skills!',
      createdAt: new Date('2024-01-15'),
      lastSeen: new Date(),
      isOnline: true
    }
  },
  {
    uid: '2',
    email: 'maria@test.com',
    password: '123456',
    displayName: 'Maria',
    profile: {
      uid: '2',
      email: 'maria@test.com',
      displayName: 'Maria',
      skills: ['Guitar', 'Piano', 'Music Theory'],
      wantToLearn: ['English', 'Public Speaking', 'Writing'],
      bio: 'Professional music teacher with 10+ years experience. Specializing in beginner to intermediate guitar and piano.',
      createdAt: new Date('2024-02-01'),
      lastSeen: new Date(),
      isOnline: true
    }
  },
  {
    uid: '3',
    email: 'test@test.com',
    password: '123456',
    displayName: 'Test User',
    profile: {
      uid: '3',
      email: 'test@test.com',
      displayName: 'Test User',
      skills: ['JavaScript', 'Web Development'],
      wantToLearn: ['Guitar', 'Spanish'],
      bio: 'Looking to exchange knowledge and learn new skills!',
      createdAt: new Date(),
      lastSeen: new Date(),
      isOnline: true
    }
  }
];

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('skill-link-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Load user profile
        const mockUser = MOCK_USERS.find(u => u.uid === parsedUser.uid);
        if (mockUser) {
          setUserProfile(mockUser.profile);
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('skill-link-user');
      }
    }
    setLoading(false);
  }, []);

  // Signup function (mock)
  const signup = async (email: string, password: string, displayName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new mock user
    const newUser = {
      uid: Date.now().toString(),
      email,
      displayName
    };

    const newProfile: UserProfile = {
      uid: newUser.uid,
      email,
      displayName,
      skills: [],
      wantToLearn: [],
      bio: '',
      createdAt: new Date(),
      lastSeen: new Date(),
      isOnline: true
    };

    // Add to mock users (in real app, this would be saved to database)
    MOCK_USERS.push({
      uid: newUser.uid,
      email,
      password,
      displayName,
      profile: newProfile
    });

    setUser(newUser);
    setUserProfile(newProfile);
    
    // Store in localStorage
    localStorage.setItem('skill-link-user', JSON.stringify(newUser));
  };

  // Login function (mock)
  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find mock user
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    const loggedInUser = {
      uid: mockUser.uid,
      email: mockUser.email,
      displayName: mockUser.displayName
    };

    setUser(loggedInUser);
    setUserProfile(mockUser.profile);
    
    // Store in localStorage
    localStorage.setItem('skill-link-user', JSON.stringify(loggedInUser));
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('skill-link-user');
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);
    
    // Update in mock data
    const mockUserIndex = MOCK_USERS.findIndex(u => u.uid === user.uid);
    if (mockUserIndex !== -1) {
      MOCK_USERS[mockUserIndex].profile = updatedProfile;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export mock users for use in other components
export { MOCK_USERS };