import React from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatRoom } from './components/ChatRoom';
import { useChatStore } from './store/chatStore';
import { generateRandomName } from './utils/nameGenerator';
import { getDeviceInfo } from './utils/deviceInfo';
import { getIpInfo } from './utils/ipInfo';
import { generateUserId, isSuperAdmin } from './config/admins';

function App() {
  const { currentUser, setCurrentUser, addUser, users } = useChatStore();

  const handleLogin = async (username: string) => {
    const randomName = generateRandomName();
    const deviceInfo = getDeviceInfo();
    const ipInfo = await getIpInfo();
    
    const isSuperAdminLogin = users.length === 0;
    const userId = generateUserId(isSuperAdminLogin);
    
    const newUser = {
      id: userId,
      name: username || randomName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || randomName}`,
      isAdmin: isSuperAdminLogin || isSuperAdmin(userId),
      isOnline: true,
      userInfo: {
        ...ipInfo,
        ...deviceInfo,
      },
    };
    
    setCurrentUser(newUser);
    addUser(newUser);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <ChatRoom />;
}

export default App;