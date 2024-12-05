import Database from 'better-sqlite3';
import { join } from 'path';
import { hashPassword } from '../utils/auth';

const dbPath = join(process.cwd(), 'chat.db');
const db = new Database(dbPath);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT TRUE,
    password_hash TEXT,
    ip TEXT,
    city TEXT,
    country TEXT,
    region TEXT,
    browser TEXT,
    os TEXT,
    device TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create chats table
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('private', 'group', 'public')),
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id)
  )
`);

// Create chat participants table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_participants (
    chat_id TEXT,
    user_id TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(chat_id, user_id),
    FOREIGN KEY(chat_id) REFERENCES chats(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// Create messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    original_content TEXT,
    sender_id TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    detected_language TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(chat_id) REFERENCES chats(id)
  )
`);

// Create public chat room
const publicChat = db.prepare(`
  INSERT OR IGNORE INTO chats (id, name, type, created_by)
  VALUES ('public', '公共聊天室', 'public', NULL)
`);

// Create super admin account
const createSuperAdmin = async () => {
  const passwordHash = await hashPassword('ainidewo42');
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, avatar, is_admin, password_hash)
    VALUES (
      'SUPER_ADMIN_001',
      '超级管理员',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
      TRUE,
      ?
    )
  `);
  stmt.run(passwordHash);
};

publicChat.run();
createSuperAdmin().catch(console.error);

export default db;