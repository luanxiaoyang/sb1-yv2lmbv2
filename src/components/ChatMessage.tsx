import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '../types/chat';
import { useChatStore } from '../store/chatStore';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  sender: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  sender,
}) => {
  const currentUser = useChatStore((state) => state.currentUser);
  const isAdmin = currentUser?.isAdmin;

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-medium mb-1">{sender}</p>
        )}
        <p className="text-sm break-words">{message.content}</p>
        {isAdmin && message.originalContent && (
          <p className="text-xs mt-1 opacity-75">
            原文 ({message.detectedLanguage}): {message.originalContent}
          </p>
        )}
        <span className="text-xs opacity-75 mt-1 block">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};