import db from './schema';
import type { User, Chat, Message } from '../types/chat';

// 用户相关查询
export const userQueries = {
  createUser: db.prepare(`
    INSERT INTO users (
      id, name, avatar, is_admin, is_online, password_hash,
      ip, city, country, region, browser, os, device
    ) VALUES (
      @id, @name, @avatar, @isAdmin, @isOnline, @passwordHash,
      @ip, @city, @country, @region, @browser, @os, @device
    )
  `),

  getUser: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  getUserByName: db.prepare('SELECT * FROM users WHERE name = ?'),
  
  getAllUsers: db.prepare('SELECT * FROM users WHERE is_online = TRUE'),
  
  updateUserStatus: db.prepare('UPDATE users SET is_online = ? WHERE id = ?'),
  
  toggleAdmin: db.prepare(`
    UPDATE users 
    SET is_admin = NOT is_admin,
        password_hash = CASE 
          WHEN NOT is_admin THEN ? 
          ELSE NULL 
        END 
    WHERE id = ?
  `),
  
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?')
};

// 聊天室相关查询
export const chatQueries = {
  createChat: db.prepare(`
    INSERT INTO chats (id, name, type, created_by)
    VALUES (@id, @name, @type, @createdBy)
  `),

  addParticipant: db.prepare(`
    INSERT INTO chat_participants (chat_id, user_id)
    VALUES (?, ?)
  `),

  getChat: db.prepare(`
    SELECT c.*, GROUP_CONCAT(cp.user_id) as participants
    FROM chats c
    LEFT JOIN chat_participants cp ON c.id = cp.chat_id
    WHERE c.id = ?
    GROUP BY c.id
  `),

  getUserChats: db.prepare(`
    SELECT c.*, GROUP_CONCAT(cp.user_id) as participants
    FROM chats c
    LEFT JOIN chat_participants cp ON c.id = cp.chat_id
    WHERE c.id = 'public'
       OR c.id IN (
          SELECT chat_id 
          FROM chat_participants 
          WHERE user_id = ?
       )
    GROUP BY c.id
  `),

  deleteChat: db.prepare('DELETE FROM chats WHERE id = ? AND type != "public"')
};

// 消息相关查询
export const messageQueries = {
  createMessage: db.prepare(`
    INSERT INTO messages (
      id, content, original_content, sender_id,
      chat_id, detected_language
    ) VALUES (
      @id, @content, @originalContent, @senderId,
      @chatId, @detectedLanguage
    )
  `),

  getChatMessages: db.prepare(`
    SELECT m.*, u.name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.chat_id = ?
    ORDER BY m.created_at ASC
  `),

  deleteMessages: db.prepare('DELETE FROM messages WHERE chat_id = ?')
};