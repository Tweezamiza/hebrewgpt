import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { createUser, getUser, updateUser } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    await createUser(userCredential.user.uid, {
      id: userCredential.user.uid,
      email,
      displayName,
      photoURL: userCredential.user.photoURL || undefined,
    });

    // Store auth token
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);

    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await updateUser(userCredential.user.uid, {
      lastLoginAt: Date.now(),
    });

    // Store auth token
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);

    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getUser(userCredential.user.uid);
    
    if (!userDoc) {
      // Create new user document if first time
      await createUser(userCredential.user.uid, {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userCredential.user.displayName!,
        photoURL: userCredential.user.photoURL || undefined,
      });
    } else {
      // Update last login
      await updateUser(userCredential.user.uid, {
        lastLoginAt: Date.now(),
      });
    }

    // Store auth token
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);

    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  user: FirebaseUser,
  updates: { displayName?: string; photoURL?: string }
) => {
  try {
    await updateProfile(user, updates);
    await updateUser(user.uid, updates);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise<FirebaseUser | null>((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return !!token;
};
