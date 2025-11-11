import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';

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

interface AuthContextType {
  user: User | null;
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user.uid);
        // Update online status
        await updateOnlineStatus(user.uid, true);
      } else {
        if (userProfile) {
          await updateOnlineStatus(userProfile.uid, false);
        }
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastSeen: data.lastSeen?.toDate() || new Date(),
        } as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateOnlineStatus = async (uid: string, isOnline: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isOnline,
        lastSeen: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        skills: [],
        wantToLearn: [],
        bio: '',
        createdAt: new Date(),
        lastSeen: new Date(),
        isOnline: true,
        rating: 5.0,
        completedSessions: 0,
        location: '',
        languages: []
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: Timestamp.now(),
        lastSeen: Timestamp.now()
      });

      setUserProfile(userProfile);
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Provide helpful error messages
      if (error.code === 'auth/api-key-not-valid') {
        throw new Error('Firebase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบไฟล์ .env และอ่าน FIREBASE_SETUP.md');
      }
      
      let errorMessage = 'การสมัครสมาชิกล้มเหลว';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'อีเมลนี้มีผู้ใช้งานแล้ว';
          break;
        case 'auth/invalid-email':
          errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
          break;
        case 'auth/weak-password':
          errorMessage = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide helpful error messages
      if (error.code === 'auth/api-key-not-valid') {
        throw new Error('Firebase ยังไม่ได้ตั้งค่า กรุณาตรวจสอบไฟล์ .env และอ่าน FIREBASE_SETUP.md');
      }
      
      let errorMessage = 'การเข้าสู่ระบบล้มเหลว';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'ไม่พบผู้ใช้ด้วยอีเมลนี้';
          break;
        case 'auth/wrong-password':
          errorMessage = 'รหัสผ่านไม่ถูกต้อง';
          break;
        case 'auth/invalid-email':
          errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง';
          break;
        case 'auth/user-disabled':
          errorMessage = 'บัญชีผู้ใช้นี้ถูกปิดการใช้งาน';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    if (user) {
      await updateOnlineStatus(user.uid, false);
    }
    await signOut(auth);
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = { ...userProfile, ...profileData };
      
      // Update in Firestore
      const updateData: any = { ...profileData };
      
      // Convert Date objects to Timestamps
      if (updateData.createdAt) {
        updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
      }
      if (updateData.lastSeen) {
        updateData.lastSeen = Timestamp.fromDate(updateData.lastSeen);
      }
      
      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      // Update Firebase Auth profile if displayName changed
      if (profileData.displayName) {
        await updateProfile(user, { displayName: profileData.displayName });
      }
      
      setUserProfile(updatedProfile);
    } catch (error: any) {
      throw new Error('Failed to update profile: ' + error.message);
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      await updatePassword(user, newPassword);
    } catch (error: any) {
      let errorMessage = 'Failed to update password';
      
      switch (error.code) {
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please log in again before changing your password';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      // Delete old photo if exists
      if (userProfile?.photoURL) {
        try {
          const oldPhotoRef = ref(storage, `profile-photos/${user.uid}/photo`);
          await deleteObject(oldPhotoRef);
        } catch (error) {
          // Old photo might not exist, ignore error
        }
      }
      
      // Upload new photo
      const photoRef = ref(storage, `profile-photos/${user.uid}/photo`);
      await uploadBytes(photoRef, file);
      
      // Get download URL
      const photoURL = await getDownloadURL(photoRef);
      
      // Update user profile with new photo URL
      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, 'users', user.uid), { photoURL });
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, photoURL });
      }
      
      return photoURL;
    } catch (error: any) {
      throw new Error('Failed to upload photo: ' + error.message);
    }
  };

  const searchUsers = async (query: string): Promise<UserProfile[]> => {
    try {
      if (!query.trim()) {
        return getAllUsers();
      }
      
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const users: UserProfile[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const userProfile: UserProfile = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastSeen: data.lastSeen?.toDate() || new Date(),
        } as UserProfile;
        
        // Filter out current user
        if (user && userProfile.uid === user.uid) return;
        
        // Search in name, skills, bio, and what they want to learn
        const searchLower = query.toLowerCase();
        if (
          userProfile.displayName.toLowerCase().includes(searchLower) ||
          userProfile.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
          userProfile.wantToLearn.some(skill => skill.toLowerCase().includes(searchLower)) ||
          userProfile.bio.toLowerCase().includes(searchLower)
        ) {
          users.push(userProfile);
        }
      });
      
      return users;
    } catch (error: any) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      const users: UserProfile[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const userProfile: UserProfile = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastSeen: data.lastSeen?.toDate() || new Date(),
        } as UserProfile;
        
        // Filter out current user
        if (user && userProfile.uid === user.uid) return;
        
        users.push(userProfile);
      });
      
      return users;
    } catch (error: any) {
      console.error('Error getting users:', error);
      return [];
    }
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