import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types/chat';

interface CreateChatModalProps {
  onClose: () => void;
  onSubmit: (name: string, type: 'private' | 'group', participants: string[]) => void;
  users: User[];
  currentUser: User;
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({
  onClose,
  onSubmit,
  users,
  currentUser,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'private' | 'group'>('private');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'private' && selectedUsers.length !== 1) {
      alert('请选择一个用户进行私聊');
      return;
    }
    if (type === 'group' && (!name || selectedUsers.length === 0)) {
      alert('请填写群组名称并选择至少一个成员');
      return;
    }
    onSubmit(
      type === 'private' ? `与 ${users.find(u => u.id === selectedUsers[0])?.name} 的私聊` : name,
      type,
      selectedUsers
    );
    onClose();
  };

  const availableUsers = users.filter(u => u.id !== currentUser.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">创建新聊天</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              聊天类型
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="private"
                  checked={type === 'private'}
                  onChange={(e) => setType(e.target.value as 'private' | 'group')}
                  className="mr-2"
                />
                私聊
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={type === 'group'}
                  onChange={(e) => setType(e.target.value as 'private' | 'group')}
                  className="mr-2"
                />
                群聊
              </label>
            </div>
          </div>

          {type === 'group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                群组名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="输入群组名称"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择成员
            </label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2">
              {availableUsers.map((user) => (
                <label key={user.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (type === 'private') {
                        setSelectedUsers(e.target.checked ? [user.id] : []);
                      } else {
                        setSelectedUsers(
                          e.target.checked
                            ? [...selectedUsers, user.id]
                            : selectedUsers.filter(id => id !== user.id)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {user.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            创建聊天
          </button>
        </form>
      </div>
    </div>
  );
};