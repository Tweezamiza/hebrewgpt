export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  lastLoginAt: number;
  premium: boolean;
  premiumUntil?: number;
  settings: UserSettings;
  stats: UserStats;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'he' | 'en';
  notifications: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  aiModel: 'gpt-4' | 'gpt-3.5-turbo';
  voiceEnabled: boolean;
}

export interface UserStats {
  totalMessages: number;
  totalChars: number;
  totalConversations: number;
  totalTokensUsed: number;
  lastActive: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  systemPrompt?: string;
  category?: string;
  isArchived: boolean;
  isPinned: boolean;
  isShared: boolean;
  sharedWith?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: number;
  attachments?: Attachment[];
  reactions?: Reaction[];
  isEdited?: boolean;
  editedAt?: number;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Reaction {
  userId: string;
  type: string;
  timestamp: number;
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired';
  startDate: number;
  endDate: number;
  autoRenew: boolean;
  price: number;
  features: string[];
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  createdBy: string;
  isPublic: boolean;
  likes: number;
  uses: number;
  category: string;
  tags: string[];
}

export interface SharedPrompt {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: number;
  category: string;
  tags: string[];
  likes: number;
  uses: number;
  isVerified: boolean;
}

export interface ErrorLog {
  id: string;
  userId?: string;
  timestamp: number;
  type: string;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export interface Analytics {
  id: string;
  userId: string;
  event: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
