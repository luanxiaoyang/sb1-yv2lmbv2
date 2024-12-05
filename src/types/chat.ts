export interface UserInfo {
  ip: string;
  city?: string;
  country?: string;
  region?: string;
  browser: string;
  os: string;
  device: string;
}

export interface Message {
  id: string;
  content: string;
  originalContent?: string;
  sender: string;
  timestamp: string;
  detectedLanguage?: string;
  chatId: string;
  type: 'private' | 'group' | 'public';
}

export interface Chat {
  id: string;
  name: string;
  type: 'private' | 'group' | 'public';
  participants: string[];
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
  isOnline: boolean;
  userInfo?: UserInfo;
}

export interface ChatState {
  messages: Message[];
  users: User[];
  currentUser: User | null;
  chats: Chat[];
  currentChat: Chat | null;
}