import { User } from '../types/chat';

// 预设的超级管理员ID列表
export const SUPER_ADMIN_IDS = ['SUPER_ADMIN_001', 'SUPER_ADMIN_002'];

// 检查是否为超级管理员
export const isSuperAdmin = (userId: string): boolean => {
  return SUPER_ADMIN_IDS.includes(userId);
};

// 生成随机用户ID
export const generateUserId = (isSuperAdmin: boolean = false): string => {
  if (isSuperAdmin) {
    return SUPER_ADMIN_IDS[0]; // 返回第一个超级管理员ID
  }
  return `USER_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};

// 检查用户是否可以管理其他管理员
export const canManageAdmins = (user: User | null): boolean => {
  if (!user) return false;
  return isSuperAdmin(user.id);
};

// 检查是否是管理员登录
export const isAdminLogin = (username: string): boolean => {
  return username.toLowerCase() === 'admin';
};