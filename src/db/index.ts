import { userQueries, chatQueries, messageQueries } from './queries';
import type { User, Chat, Message } from '../types/chat';

export const dbService = {
  // 用户相关操作
  users: {
    create: (user: User) => {
      const { userInfo, ...userData } = user;
      return userQueries.createUser.run({
        ...userData,
        ...userInfo,
      });
    },

    getById: (id: string): User | undefined => {
      const user = userQueries.getUser.get(id);
      if (!user) return undefined;
      
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isAdmin: Boolean(user.is_admin),
        isOnline: Boolean(user.is_online),
        userInfo: {
          ip: user.ip,
          city: user.city,
          country: user.country,
          region: user.region,
          browser: user.browser,
          os: user.os,
          device: user.device,
        },
      };
    },

    getAll: (): User[] => {
      const users = userQueries.getAllUsers.all();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isAdmin: Boolean(user.is_admin),
        isOnline: Boolean(user.is_online),
        userInfo: {
          ip: user.ip,
          city: user.city,
          country: user.country,
          region: user.region,
          browser: user.browser,
          os: user.os,
          device: user.device,
        },
      }));
    },

    toggleAdmin: (userId: string) => {
      return userQueries.toggleAdmin.run(userId);
    },

    delete: (userId: string) => {
      return userQueries.deleteUser.run(userId);
    },
  },

  // 聊天室相关操作
  chats: {
    create: (chat: Chat) => {
      const result = chatQueries.createChat.run({
        id: chat.id,
        name: chat.name,
        type: chat.type,
        createdBy: chat.createdBy,
      });

      chat.participants.forEach(userId => {
        chatQueries.addParticipant.run(chat.id, userId);
      });

      return result;
    },

    getById: (chatId: string): Chat | undefined => {
      const chat = chatQueries.getChat.get(chatId);
      if (!chat) return undefined;

      return {
        id: chat.id,
        name: chat.name,
        type: chat.type as 'private' | 'group' | 'public',
        participants: chat.participants ? chat.participants.split(',') : [],
        createdBy: chat.created_by,
        createdAt: chat.created_at,
      };
    },

    getUserChats: (userId: string): Chat[] => {
      const chats = chatQueries.getUserChats.all(userId);
      return chats.map(chat => ({
        id: chat.id,
        name: chat.name,
        type: chat.type as 'private' | 'group' | 'public',
        participants: chat.participants ? chat.participants.split(',') : [],
        createdBy: chat.created_by,
        createdAt: chat.created_at,
      }));
    },

    delete: (chatId: string) => {
      messageQueries.deleteMessages.run(chatId);
      return chatQueries.deleteChat.run(chatId);
    },
  },

  // 消息相关操作
  messages: {
    create: (message: Message) => {
      return messageQueries.createMessage.run({
        id: message.id,
        content: message.content,
        originalContent: message.originalContent,
        senderId: message.sender,
        chatId: message.chatId,
        detectedLanguage: message.detectedLanguage,
      });
    },

    getChatMessages: (chatId: string): Message[] => {
      const messages = messageQueries.getChatMessages.all(chatId);
      return messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        originalContent: msg.original_content,
        sender: msg.sender_id,
        timestamp: msg.created_at,
        detectedLanguage: msg.detected_language,
        chatId: msg.chat_id,
        type: msg.type,
      }));
    },
  },
};