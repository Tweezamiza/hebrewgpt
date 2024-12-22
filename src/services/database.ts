import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import {
  User,
  Conversation,
  Message,
  AIPersonality,
  SharedPrompt,
  Subscription,
} from '../types/database';

// User Operations
export const createUser = async (userId: string, userData: Partial<User>) => {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    premium: false,
    settings: {
      theme: 'dark',
      language: 'he',
      notifications: true,
      soundEnabled: true,
      hapticEnabled: true,
      fontSize: 'medium',
      aiModel: 'gpt-4',
      voiceEnabled: false,
    },
    stats: {
      totalMessages: 0,
      totalChars: 0,
      totalConversations: 0,
      totalTokensUsed: 0,
      lastActive: Date.now(),
    },
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? (userDoc.data() as User) : null;
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  await updateDoc(doc(db, 'users', userId), updates);
};

// Conversation Operations
export const createConversation = async (userId: string, title: string): Promise<string> => {
  const conversationRef = doc(collection(db, 'conversations'));
  const conversation: Conversation = {
    id: conversationRef.id,
    userId,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
    isArchived: false,
    isPinned: false,
    isShared: false,
  };
  await setDoc(conversationRef, conversation);
  return conversationRef.id;
};

export const getConversation = async (conversationId: string): Promise<Conversation | null> => {
  const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));
  return conversationDoc.exists() ? (conversationDoc.data() as Conversation) : null;
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const q = query(
    collection(db, 'conversations'),
    where('userId', '==', userId),
    where('isArchived', '==', false),
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Conversation);
};

export const addMessageToConversation = async (
  conversationId: string,
  message: Omit<Message, 'id' | 'conversationId'>
) => {
  const conversationRef = doc(db, 'conversations', conversationId);
  const messageDoc = doc(collection(db, 'messages'));
  const newMessage: Message = {
    ...message,
    id: messageDoc.id,
    conversationId,
  };
  
  await setDoc(messageDoc, newMessage);
  await updateDoc(conversationRef, {
    updatedAt: Date.now(),
    messages: [...(await getConversation(conversationId))?.messages || [], newMessage],
  });
  
  return newMessage;
};

// AI Personality Operations
export const createAIPersonality = async (personality: Omit<AIPersonality, 'id'>) => {
  const personalityRef = doc(collection(db, 'aiPersonalities'));
  await setDoc(personalityRef, { ...personality, id: personalityRef.id });
};

export const getPublicAIPersonalities = async (): Promise<AIPersonality[]> => {
  const q = query(
    collection(db, 'aiPersonalities'),
    where('isPublic', '==', true),
    orderBy('uses', 'desc'),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as AIPersonality);
};

// Shared Prompt Operations
export const createSharedPrompt = async (prompt: Omit<SharedPrompt, 'id'>) => {
  const promptRef = doc(collection(db, 'sharedPrompts'));
  await setDoc(promptRef, { ...prompt, id: promptRef.id });
};

export const getPopularPrompts = async (): Promise<SharedPrompt[]> => {
  const q = query(
    collection(db, 'sharedPrompts'),
    where('isVerified', '==', true),
    orderBy('uses', 'desc'),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SharedPrompt);
};

// Subscription Operations
export const createSubscription = async (subscription: Omit<Subscription, 'id'>) => {
  const subscriptionRef = doc(collection(db, 'subscriptions'));
  await setDoc(subscriptionRef, { ...subscription, id: subscriptionRef.id });
};

export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  const q = query(
    collection(db, 'subscriptions'),
    where('userId', '==', userId),
    where('status', '==', 'active'),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as Subscription);
};
