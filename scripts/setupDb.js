import { join } from 'path';
import Database from 'better-sqlite3';

const dbPath = join(process.cwd(), 'chat.db');
console.log(`Setting up database at: ${dbPath}`);

try {
  const db = new Database(dbPath);
  
  // 创建表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      is_online BOOLEAN DEFAULT TRUE,
      ip TEXT,
      city TEXT,
      country TEXT,
      region TEXT,
      browser TEXT,
      os TEXT,
      device TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('private', 'group', 'public')),
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS chat_participants (
      chat_id TEXT,
      user_id TEXT,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(chat_id, user_id),
      FOREIGN KEY(chat_id) REFERENCES chats(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

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
    );
  `);

  // 创建公共聊天室
  db.exec(`
    INSERT OR IGNORE INTO chats (id, name, type, created_by)
    VALUES ('public', '公共聊天室', 'public', NULL);
  `);

  console.log('Database setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error setting up database:', error);
  process.exit(1);
}