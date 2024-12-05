import React from 'react';
import { MessageSquare, Users, User as UserIcon, Trash2 } from 'lucide-react';
import { Chat, User } from '../types/chat';
import { useChatStore } from '../store/chatStore';

interface ChatListProps {
  chats: Chat[];
  currentUser: User;
  users: User[];
  onCreateChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentUser,
  users,
  onCreateChat,
}) => {
  const { setCurrentChat, currentChat, deleteChat } = useChatStore();

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'private':
        return <UserIcon size={20} />;
      case 'group':
        return <Users size={20} />;
      default:
        return <MessageSquare size={20} />;
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'private') {
      const otherUser = users.find(u => 
        chat.participants.includes(u.id) && u.id !== currentUser.id
      );
      return otherUser?.name || chat.name;
    }
    return chat.name;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">聊天列表</h2>
        {currentUser.isAdmin && (
          <button
            onClick={onCreateChat}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            新建聊天
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
              currentChat?.id === chat.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setCurrentChat(chat.id)}
          >
            <div className="flex items-center gap-3">
              {getChatIcon(chat.type)}
              <div>
                <p className="font-medium">{getChatName(chat)}</p>
                <p className="text-sm text-gray-500">
                  {chat.type === 'public'
                    ? '公共聊天室'
                    : `${chat.participants.length} 位成员`}
                </p>
              </div>
            </div>
            {currentUser.isAdmin && chat.type !== 'public' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};