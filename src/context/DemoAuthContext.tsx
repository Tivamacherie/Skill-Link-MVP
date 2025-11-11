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
    email: 'sarah.teacher@demo.com',
    password: '123456',
    profile: {
      uid: '1',
      email: 'sarah.teacher@demo.com',
      displayName: 'Sarah Wilson',
      skills: ['English Teaching', 'IELTS Preparation', 'Business English', 'Conversation Practice'],
      wantToLearn: ['Spanish', 'Guitar', 'Cooking', 'Photography'],
      bio: 'Certified English teacher with 8 years of experience. I specialize in helping students improve their conversational skills and prepare for IELTS exams.',
      createdAt: new Date('2024-01-15'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.9,
      completedSessions: 156
    }
  },
  {
    uid: '2',
    email: 'mike.guitar@demo.com',
    password: '123456',
    profile: {
      uid: '2',
      email: 'mike.guitar@demo.com',
      displayName: 'Mike Rodriguez',
      skills: ['Guitar', 'Piano', 'Music Theory', 'Song Writing'],
      wantToLearn: ['French', 'Cooking', 'Photography', 'Digital Marketing'],
      bio: 'Professional musician and music teacher with 12+ years of experience. I teach guitar from beginner to advanced levels.',
      createdAt: new Date('2024-02-01'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.8,
      completedSessions: 89
    }
  },
  {
    uid: '3',
    email: 'emma.dev@demo.com',
    password: '123456',
    profile: {
      uid: '3',
      email: 'emma.dev@demo.com',
      displayName: 'Emma Chen',
      skills: ['React', 'JavaScript', 'Python', 'Web Development', 'UI/UX Design'],
      wantToLearn: ['Mandarin', 'Violin', 'Yoga', 'Investment'],
      bio: 'Full-stack developer passionate about teaching coding. I help beginners start their programming journey.',
      createdAt: new Date('2024-02-15'),
      lastSeen: new Date(),
      isOnline: false,
      rating: 4.7,
      completedSessions: 67
    }
  },
  {
    uid: '4',
    email: 'chef.antonio@demo.com',
    password: '123456',
    profile: {
      uid: '4',
      email: 'chef.antonio@demo.com',
      displayName: 'Antonio Rossi',
      skills: ['Italian Cooking', 'Pasta Making', 'Wine Pairing', 'Baking'],
      wantToLearn: ['English', 'Photography', 'Guitar', 'Business'],
      bio: 'Professional chef from Italy. I love sharing authentic Italian recipes and cooking techniques with food enthusiasts.',
      createdAt: new Date('2024-03-01'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.9,
      completedSessions: 98
    }
  },
  {
    uid: '5',
    email: 'dr.lisa@demo.com',
    password: '123456',
    profile: {
      uid: '5',
      email: 'dr.lisa@demo.com',
      displayName: 'Dr. Lisa Park',
      skills: ['Korean Language', 'Medical Knowledge', 'Study Techniques', 'TOPIK Preparation'],
      wantToLearn: ['Piano', 'Drawing', 'French', 'Rock Climbing'],
      bio: 'Korean doctor and language teacher. I help students learn Korean effectively and prepare for TOPIK exams.',
      createdAt: new Date('2024-03-10'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.8,
      completedSessions: 134
    }
  },
  {
    uid: '6',
    email: 'yoga.master@demo.com',
    password: '123456',
    profile: {
      uid: '6',
      email: 'yoga.master@demo.com',
      displayName: 'Maya Singh',
      skills: ['Yoga', 'Meditation', 'Mindfulness', 'Pilates', 'Wellness Coaching'],
      wantToLearn: ['Spanish', 'Cooking', 'Photography', 'Writing'],
      bio: 'Certified yoga instructor with expertise in Hatha and Vinyasa yoga. I help people find balance in mind and body.',
      createdAt: new Date('2024-03-20'),
      lastSeen: new Date(),
      isOnline: false,
      rating: 4.9,
      completedSessions: 201
    }
  },
  {
    uid: '7',
    email: 'photo.pro@demo.com',
    password: '123456',
    profile: {
      uid: '7',
      email: 'photo.pro@demo.com',
      displayName: 'James Thompson',
      skills: ['Photography', 'Lightroom', 'Photoshop', 'Portrait Photography', 'Wedding Photography'],
      wantToLearn: ['Video Editing', 'Japanese', 'Guitar', 'Business'],
      bio: 'Professional photographer specializing in portraits and weddings. I teach photography techniques from basics to advanced.',
      createdAt: new Date('2024-04-01'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.6,
      completedSessions: 78
    }
  },
  {
    uid: '8',
    email: 'french.native@demo.com',
    password: '123456',
    profile: {
      uid: '8',
      email: 'french.native@demo.com',
      displayName: 'Sophie Dubois',
      skills: ['French Language', 'French Culture', 'Translation', 'DELF Preparation'],
      wantToLearn: ['Yoga', 'Cooking', 'Programming', 'Drawing'],
      bio: 'Native French speaker from Paris. I teach French language and culture, helping students achieve fluency naturally.',
      createdAt: new Date('2024-04-15'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.8,
      completedSessions: 112
    }
  },
  {
    uid: '9',
    email: 'fitness.coach@demo.com',
    password: '123456',
    profile: {
      uid: '9',
      email: 'fitness.coach@demo.com',
      displayName: 'Alex Johnson',
      skills: ['Personal Training', 'Nutrition', 'Weight Loss', 'Strength Training', 'CrossFit'],
      wantToLearn: ['Spanish', 'Cooking', 'Photography', 'Guitar'],
      bio: 'Certified personal trainer and nutrition specialist. I help people achieve their fitness goals through personalized training programs.',
      createdAt: new Date('2024-05-01'),
      lastSeen: new Date(),
      isOnline: false,
      rating: 4.7,
      completedSessions: 143
    }
  },
  {
    uid: '10',
    email: 'art.teacher@demo.com',
    password: '123456',
    profile: {
      uid: '10',
      email: 'art.teacher@demo.com',
      displayName: 'Maria Garcia',
      skills: ['Drawing', 'Painting', 'Digital Art', 'Art History', 'Watercolor'],
      wantToLearn: ['Photography', 'Guitar', 'Italian', 'Cooking'],
      bio: 'Professional artist and art teacher. I teach various drawing and painting techniques for all skill levels.',
      createdAt: new Date('2024-05-15'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.8,
      completedSessions: 95
    }
  },
  {
    uid: '11',
    email: 'spanish.tutor@demo.com',
    password: '123456',
    profile: {
      uid: '11',
      email: 'spanish.tutor@demo.com',
      displayName: 'Carlos Mendez',
      skills: ['Spanish Language', 'Latin American Culture', 'DELE Preparation', 'Business Spanish'],
      wantToLearn: ['English', 'Programming', 'Photography', 'Fitness'],
      bio: 'Native Spanish speaker from Mexico. I specialize in conversational Spanish and helping students prepare for DELE exams.',
      createdAt: new Date('2024-06-01'),
      lastSeen: new Date(),
      isOnline: true,
      rating: 4.9,
      completedSessions: 87
    }
  },
  {
    uid: '12',
    email: 'piano.virtuoso@demo.com',
    password: '123456',
    profile: {
      uid: '12',
      email: 'piano.virtuoso@demo.com',
      displayName: 'David Kim',
      skills: ['Piano', 'Music Theory', 'Classical Music', 'Jazz Piano', 'Composition'],
      wantToLearn: ['Korean', 'Cooking', 'Photography', 'Web Development'],
      bio: 'Classically trained pianist with performance experience. I teach piano from beginner to advanced levels.',
      createdAt: new Date('2024-06-15'),
      lastSeen: new Date(),
      isOnline: false,
      rating: 4.8,
      completedSessions: 156
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
      throw new Error('This email is already registered');
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
      throw new Error('Invalid email or password');
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
    if (!user) throw new Error('No authenticated user');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = DEMO_USERS.findIndex(u => u.uid === user.uid);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex].password = newPassword;
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('No authenticated user');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a real URL for the uploaded image using FileReader
    const photoURL = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
    
    if (userProfile) {
      const updatedProfile = { ...userProfile, photoURL };
      setUserProfile(updatedProfile);
      
      const userIndex = DEMO_USERS.findIndex(u => u.uid === user.uid);
      if (userIndex !== -1) {
        DEMO_USERS[userIndex].profile = updatedProfile;
      }
    }
    
    return photoURL;
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