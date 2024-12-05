import React, { useState, useEffect } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import { SUPER_ADMIN_IDS } from '../config/admins';
import { validatePassword } from '../utils/auth';
import { dbService } from '../db';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [error, setError] = useState('');

  const handleTitleClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(currentTime);
  };

  useEffect(() => {
    if (clickCount >= 5) {
      setShowAdminLogin(true);
      setClickCount(0);
    }
  }, [clickCount]);

  const handleAdminLogin = async () => {
    setError('');
    const user = await dbService.users.getByName(username);
    
    if (!user) {
      setError('用户名或密码错误');
      return false;
    }

    if (user.isAdmin) {
      const isValid = await validatePassword(password, user.passwordHash || '');
      if (!isValid) {
        setError('用户名或密码错误');
        return false;
      }
      return true;
    }

    setError('权限不足');
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showAdminLogin) {
      const isValid = await handleAdminLogin();
      if (isValid) {
        onLogin(username);
      }
    } else {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 
          className="text-2xl font-bold mb-6 text-center cursor-default select-none"
          onClick={handleTitleClick}
        >
          {showAdminLogin ? '管理员登录' : '加入聊天'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {showAdminLogin ? '管理员账号' : '用户名 (可选)'}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder={showAdminLogin ? '输入管理员账号' : '留空将生成随机名字'}
            />
          </div>
          
          {showAdminLogin && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="输入管理员密码"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 ${
              showAdminLogin 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white py-2 px-4 rounded-md transition-colors`}
          >
            {showAdminLogin ? (
              <>
                <Shield size={20} />
                管理员登录
              </>
            ) : (
              <>
                <UserPlus size={20} />
                加入聊天
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};