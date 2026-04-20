import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); // global profile data

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  // Fetch profile from Firestore — called after login and after profile save
  const refreshProfile = useCallback(async (user) => {
    if (!user) { setUserProfile(null); return; }
    try {
      const snap = await getDoc(doc(db, 'userProfiles', user.uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
      } else {
        setUserProfile(null);
      }
    } catch {
      setUserProfile(null); // rules may still be updating — silent fail
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      refreshProfile(user).finally(() => setLoading(false));
    });
    return unsubscribe;
  }, [refreshProfile]);

  // Derived display name — profile name > email prefix
  const displayName = userProfile?.displayName
    || currentUser?.email?.split('@')[0]
    || '';

  const value = { currentUser, loading, userProfile, displayName, refreshProfile, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
