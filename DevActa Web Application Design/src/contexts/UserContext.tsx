import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string | null;
  githubLink: string;
  linkedinLink: string;
  otherSocials: string[];
  trophies?: number;
}

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);

  const setUserProfile = (profile: UserProfile) => {
    const profileWithTrophies = {
      ...profile,
      trophies: profile.trophies || 0,
    };
    setUserProfileState(profileWithTrophies);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfileState({ ...userProfile, ...updates });
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
