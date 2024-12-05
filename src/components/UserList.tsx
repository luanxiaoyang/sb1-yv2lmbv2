import React, { useState } from 'react';
import { Shield, UserX, Info, X } from 'lucide-react';
import type { User } from '../types/chat';
import { useChatStore } from '../store/chatStore';
import { UserDetails } from './UserDetails';
import { canManageAdmins, isSuperAdmin } from '../config/admins';

interface UserListProps {
  users: User[];
  onKickUser: (userId: string) => void;
  onToggleAdmin: (userId: string) => void;
  onClose: () => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onKickUser,
  onToggleAdmin,
  onClose,
}) => {
  const currentUser = useChatStore((state) => state.currentUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">在线用户</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full md:hidden"
          aria-label="Close user list"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="text-sm font-medium">
                  {user.name}
                  {user.isAdmin && (
                    <span className="ml-1 text-blue-500 text-xs">
                      ({isSuperAdmin(user.id) ? '超级管理员' : '管理员'})
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {currentUser?.isAdmin && (
                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-1 text-gray-500 hover:text-blue-500"
                  title="查看用户信息"
                >
                  <Info size={16} />
                </button>
              )}
              {canManageAdmins(currentUser) && user.id !== currentUser.id && !isSuperAdmin(user.id) && (
                <>
                  <button
                    onClick={() => onToggleAdmin(user.id)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                    title={user.isAdmin ? "移除管理员" : "设为管理员"}
                  >
                    <Shield size={16} />
                  </button>
                  <button
                    onClick={() => onKickUser(user.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                    title="踢出用户"
                  >
                    <UserX size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};