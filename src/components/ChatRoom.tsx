import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UserList } from './UserList';
import { ChatList } from './ChatList';
import { CreateChatModal } from './CreateChatModal';
import { MobileHeader } from './MobileHeader';
import { useChatStore } from '../store/chatStore';

export const ChatRoom: React.FC = () => {
  const {
    messages,
    users,
    currentUser,
    chats,
    currentChat,
    addMessage,
    removeUser,
    toggleAdmin,
    createChat,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKickUser = (userId: string) => {
    if (currentUser?.isAdmin) {
      removeUser(userId);
    }
  };

  const handleToggleAdmin = (userId: string) => {
    if (currentUser?.isAdmin) {
      toggleAdmin(userId);
    }
  };

  const filteredMessages = messages.filter(
    (message) => message.chatId === currentChat?.id
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Chat List Sidebar */}
      <div className="w-64 border-r hidden md:block">
        <ChatList
          chats={chats}
          currentUser={currentUser!}
          users={users}
          onCreateChat={() => setShowCreateChat(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        <MobileHeader
          currentUser={currentUser}
          currentChat={currentChat}
          onToggleUserList={() => setShowUserList(!showUserList)}
        />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.sender === currentUser?.id}
              sender={users.find(u => u.id === message.sender)?.name || 'Unknown'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput onSendMessage={(content) => addMessage(content)} />
      </div>
      
      {/* User List Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${showUserList ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <UserList
          users={users}
          onKickUser={handleKickUser}
          onToggleAdmin={handleToggleAdmin}
          onClose={() => setShowUserList(false)}
        />
      </div>

      {/* Modals */}
      {showCreateChat && (
        <CreateChatModal
          onClose={() => setShowCreateChat(false)}
          onSubmit={createChat}
          users={users}
          currentUser={currentUser!}
        />
      )}

      {/* Mobile Overlay */}
      {showUserList && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowUserList(false)}
        />
      )}
    </div>
  );
};