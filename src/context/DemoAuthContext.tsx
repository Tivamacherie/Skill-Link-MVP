import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Demo User Profile Type
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
  rating?: number;
  completedSessions?: number;
  location?: string;
  languages?: string[];
}

// Demo User Type
interface DemoUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: DemoUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
  searchUsers: (query: string) => Promise<UserProfile[]>;
  getAllUsers: () => Promise<UserProfile[]>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo
let DEMO_USERS: any[] = [
  {
    uid: '1',
    email: 'demo1@test.com',
    password: '123456',
    profile: {
      uid: '1',
      email: 'demo1@test.com',
      displayName: 'สมใจ',
      skills: ['ภาษาไทย', 'การเขียน', 'การสื่อสาร'],
      wantToLearn: ['กีตาร์', 'ทฤษฎีดนตรี', 'เปียโน'],
      bio: 'ครูสอนภาษาไทยมี 5 ปีประสบการณ์ รักการช่วยเหลือผู้คนในการพัฒนาทักษะการสื่อสาร',
      createdAt: new Date('2024-01-15'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.8,
      completedSessions: 12
    }
  },
  {
    uid: '2', 
    email: 'demo2@test.com',
    password: '123456',
    profile: {
      uid: '2',
      email: 'demo2@test.com',
      displayName: 'นักดนตรี',
      skills: ['กีตาร์', 'เปียโน', 'ทฤษฎีดนตรี'],
      wantToLearn: ['ภาษาอังกฤษ', 'การพูดในที่สาธารณะ', 'การเขียน'],
      bio: 'ครูสอนดนตรีมืออาชีพ 10+ ปี เชี่ยวชาญกีตาร์และเปียโนตั้งแต่ระดับเริ่มต้นถึงระดับกลาง',
      createdAt: new Date('2024-02-01'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.9,
      completedSessions: 25
    }
  }
];

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('demo-skill-link-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const demoUser = DEMO_USERS.find(u => u.uid === parsedUser.uid);
        if (demoUser) {
          setUserProfile(demoUser.profile);
        }
      } catch (error) {
        localStorage.removeItem('demo-skill-link-user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = DEMO_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว');
    }

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
      isOnline: true,
      rating: 5.0,
      completedSessions: 0
    };

    DEMO_USERS.push({
      uid: newUser.uid,
      email,
      password,
      profile: newProfile
    });

    setUser(newUser);
    setUserProfile(newProfile);
    localStorage.setItem('demo-skill-link-user', JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!demoUser) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const loggedInUser = {
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.profile.displayName
    };

    setUser(loggedInUser);
    setUserProfile(demoUser.profile);
    localStorage.setItem('demo-skill-link-user', JSON.stringify(loggedInUser));
  };

  const logout = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('demo-skill-link-user');
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);
    
    const userIndex = DEMO_USERS.findIndex(u => u.uid === user.uid);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex].profile = updatedProfile;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!user) throw new Error('ไม่พบผู้ใช้งาน');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = DEMO_USERS.findIndex(u => u.uid === user.uid);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex].password = newPassword;
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('ไม่พบผู้ใช้งาน');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // สร้าง URL จำลองสำหรับรูปภาพ
    const fakeURL = `https://via.placeholder.com/150x150/4285F4/white?text=${encodeURIComponent(userProfile?.displayName?.charAt(0) || 'U')}`;
    
    if (userProfile) {
      const updatedProfile = { ...userProfile, photoURL: fakeURL };
      setUserProfile(updatedProfile);
      
      const userIndex = DEMO_USERS.findIndex(u => u.uid === user.uid);
      if (userIndex !== -1) {
        DEMO_USERS[userIndex].profile = updatedProfile;
      }
    }
    
    return fakeURL;
  };

  const searchUsers = async (query: string): Promise<UserProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      return getAllUsers();
    }
    
    const searchLower = query.toLowerCase();
    return DEMO_USERS
      .filter(u => user && u.uid !== user.uid)
      .map(u => u.profile)
      .filter(profile => 
        profile.displayName.toLowerCase().includes(searchLower) ||
        profile.skills.some((skill: string) => skill.toLowerCase().includes(searchLower)) ||
        profile.wantToLearn.some((skill: string) => skill.toLowerCase().includes(searchLower)) ||
        profile.bio.toLowerCase().includes(searchLower)
      );
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return DEMO_USERS
      .filter(u => user && u.uid !== user.uid)
      .map(u => u.profile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    updateUserPassword,
    uploadProfilePhoto,
    searchUsers,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};