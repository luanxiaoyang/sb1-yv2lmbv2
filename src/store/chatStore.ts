import { create } from 'zustand';
import type { ChatState, Message, User, Chat } from '../types/chat';
import { detectLanguage, translateToZh } from '../utils/translator';
import { canManageAdmins, isSuperAdmin } from '../config/admins';
import { storage } from '../db/storage';

const PUBLIC_CHAT_ID = 'public';

export const useChatStore = create<ChatState & {
  setCurrentUser: (user: User) => Promise<void>;
  addMessage: (content: string, chatId?: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  toggleAdmin: (userId: string) => Promise<void>;
  createChat: (name: string, type: 'private' | 'group', participants: string[]) => Promise<void>;
  setCurrentChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}>((set, get) => ({
  messages: [],
  users: [],
  currentUser: null,
  chats: [],
  currentChat: null,

  setCurrentUser: async (user) => {
    await storage.createUser(user);
    const chats = await storage.getAllChats();
    const users = await storage.getAllUsers();
    
    set({
      currentUser: user,
      users,
      chats,
      currentChat: chats[0],
    });
  },

  addMessage: async (content, chatId) => {
    const state = get();
    if (!state.currentUser) return;

    const targetChatId = chatId || state.currentChat?.id || PUBLIC_CHAT_ID;
    const detectedLanguage = detectLanguage(content);
    let translatedContent = content;
    let originalContent;

    if (state.currentUser.isAdmin) {
      translatedContent = await translateToZh(content);
      originalContent = content;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: translatedContent,
      originalContent,
      sender: state.currentUser.id,
      timestamp: new Date().toISOString(),
      detectedLanguage: state.currentUser.isAdmin ? detectedLanguage : undefined,
      chatId: targetChatId,
      type: state.chats.find(c => c.id === targetChatId)?.type || 'public',
    };

    await storage.createMessage(newMessage);
    const messages = await storage.getChatMessages(targetChatId);
    set({ messages });
  },

  addUser: async (user) => {
    await storage.createUser(user);
    const users = await storage.getAllUsers();
    set({ users });
  },

  removeUser: async (userId) => {
    const state = get();
    if (isSuperAdmin(userId)) return;
    
    const currentUser = state.currentUser;
    const targetUser = state.users.find(u => u.id === userId);
    if (targetUser?.isAdmin && !canManageAdmins(currentUser)) return;

    await storage.deleteUser(userId);
    const users = await storage.getAllUsers();
    
    set({
      users,
      currentUser: state.currentUser?.id === userId ? null : state.currentUser,
    });
  },

  toggleAdmin: async (userId) => {
    const state = get();
    if (isSuperAdmin(userId)) return;
    if (!canManageAdmins(state.currentUser)) return;

    const user = await storage.getUser(userId);
    if (user) {
      user.isAdmin = !user.isAdmin;
      await storage.updateUser(user);
      const users = await storage.getAllUsers();
      
      set({
        users,
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, isAdmin: !state.currentUser.isAdmin }
            : state.currentUser,
      });
    }
  },

  createChat: async (name, type, participants) => {
    const state = get();
    if (!state.currentUser?.isAdmin) return;

    const newChat: Chat = {
      id: crypto.randomUUID(),
      name,
      type,
      participants: [...participants, state.currentUser.id],
      createdBy: state.currentUser.id,
      createdAt: new Date().toISOString(),
    };

    await storage.createChat(newChat);
    const chats = await storage.getAllChats();
    
    set({
      chats,
      currentChat: newChat,
    });
  },

  setCurrentChat: async (chatId) => {
    const chat = await storage.getChat(chatId);
    const messages = await storage.getChatMessages(chatId);
    
    set({
      currentChat: chat || (await storage.getChat(PUBLIC_CHAT_ID)),
      messages,
    });
  },

  deleteChat: async (chatId) => {
    const state = get();
    if (chatId === PUBLIC_CHAT_ID) return;
    if (!state.currentUser?.isAdmin) return;

    const chat = await storage.getChat(chatId);
    if (!chat || (chat.createdBy !== state.currentUser.id && !isSuperAdmin(state.currentUser.id))) {
      return;
    }

    await storage.deleteChat(chatId);
    const chats = await storage.getAllChats();
    const publicChat = await storage.getChat(PUBLIC_CHAT_ID);
    
    set({
      chats,
      currentChat: state.currentChat?.id === chatId ? publicChat : state.currentChat,
    });
  },
}));