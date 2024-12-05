import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import type { User, Chat, Message } from '../types/chat';
import { hashPassword } from '../utils/auth';

interface ChatDB extends DBSchema {
  users: {
    key: string;
    value: User & { passwordHash?: string };
  };
  chats: {
    key: string;
    value: Chat;
  };
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-chat': string };
  };
}

const dbPromise = openDB<ChatDB>('chat-app', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id' });
    db.createObjectStore('chats', { keyPath: 'id' });
    const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
    messagesStore.createIndex('by-chat', 'chatId');

    // Create public chat
    const chatsStore = db.transaction('chats', 'readwrite').objectStore('chats');
    chatsStore.add({
      id: 'public',
      name: '公共聊天室',
      type: 'public',
      participants: [],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
    });

    // Create super admin
    const usersStore = db.transaction('users', 'readwrite').objectStore('users');
    usersStore.add({
      id: 'SUPER_ADMIN_001',
      name: '超级管理员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
      isAdmin: true,
      isOnline: true,
      passwordHash: hashPassword('ainidewo42'),
    });
  },
});

export const storage = {
  async getUser(id: string) {
    return (await dbPromise).get('users', id);
  },

  async getUserByName(name: string) {
    const db = await dbPromise;
    const users = await db.getAll('users');
    return users.find(user => user.name === name);
  },

  async getAllUsers() {
    return (await dbPromise).getAll('users');
  },

  async createUser(user: User) {
    return (await dbPromise).add('users', user);
  },

  async updateUser(user: User) {
    return (await dbPromise).put('users', user);
  },

  async deleteUser(id: string) {
    return (await dbPromise).delete('users', id);
  },

  async getChat(id: string) {
    return (await dbPromise).get('chats', id);
  },

  async getAllChats() {
    return (await dbPromise).getAll('chats');
  },

  async createChat(chat: Chat) {
    return (await dbPromise).add('chats', chat);
  },

  async updateChat(chat: Chat) {
    return (await dbPromise).put('chats', chat);
  },

  async deleteChat(id: string) {
    const db = await dbPromise;
    await db.delete('chats', id);
    
    // Delete associated messages
    const tx = db.transaction('messages', 'readwrite');
    const index = tx.store.index('by-chat');
    let cursor = await index.openCursor(IDBKeyRange.only(id));
    
    while (cursor) {
      cursor.delete();
      cursor = await cursor.continue();
    }
  },

  async createMessage(message: Message) {
    return (await dbPromise).add('messages', message);
  },

  async getChatMessages(chatId: string) {
    const db = await dbPromise;
    const index = db.transaction('messages').store.index('by-chat');
    return index.getAll(IDBKeyRange.only(chatId));
  },
};