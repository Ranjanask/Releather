import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const newUserData = {
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            itemsRecycled: 0,
            co2Saved: 0,
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', user.uid), newUserData);
          setUserData(newUserData as UserProfile);
        } else {
          setUserData(userDoc.data() as UserProfile);
        }
      } else {
        setUserData(null);
      }
      setLoading(loading => false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Popup request was cancelled due to a newer request.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.warn("User closed the popup.");
      } else {
        // We could use toast here if we had access to it, 
        // but let's just log it for now to avoid side effects in the hook
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => signOut(auth);

  return { user, userData, loading, isLoggingIn, login, logout };
}
