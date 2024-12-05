import React from 'react';
import { User } from '../types/chat';
import { Monitor, Globe, MapPin } from 'lucide-react';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  if (!user.userInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">用户详情: {user.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="text-gray-500" size={20} />
            <div>
              <p className="font-medium">位置信息</p>
              <p className="text-sm text-gray-600">
                IP: {user.userInfo.ip}
                {user.userInfo.city && (
                  <span className="ml-2">
                    {user.userInfo.city}, {user.userInfo.region}, {user.userInfo.country}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Monitor className="text-gray-500" size={20} />
            <div>
              <p className="font-medium">设备信息</p>
              <p className="text-sm text-gray-600">
                浏览器: {user.userInfo.browser}<br />
                操作系统: {user.userInfo.os}<br />
                设备类型: {user.userInfo.device}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};