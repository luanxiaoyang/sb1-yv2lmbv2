import React from 'react';
import { Menu, Users } from 'lucide-react';
import { User, Chat } from '../types/chat';

interface MobileHeaderProps {
  currentUser: User | null;
  currentChat: Chat | null;
  onToggleUserList: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentUser,
  currentChat,
  onToggleUserList,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white md:hidden">
      <div className="flex items-center gap-2">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-medium">{currentUser?.name}</span>
          <span className="text-sm text-gray-500">{currentChat?.name}</span>
        </div>
      </div>
      <button
        onClick={onToggleUserList}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Toggle user list"
      >
        <Users size={24} />
      </button>
    </div>
  );
};