import React, { createContext, useContext, useState, type ReactNode } from 'react'; // <-- FIX 1: Thêm 'type'

// Định nghĩa "khuôn mẫu" cho Context
interface IChatContext {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

// Tạo Context
const ChatContext = createContext<IChatContext | null>(null);

// Tạo "Nhà cung cấp" (Provider)
// Component này sẽ "bọc" toàn bộ ứng dụng của chúng ta
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <ChatContext.Provider value={{ isChatOpen, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// Tạo một "hook" tùy chỉnh để dễ dàng sử dụng
// eslint-disable-next-line react-refresh/only-export-components // <-- FIX 2: Thêm dòng này
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat phải được dùng bên trong ChatProvider');
  }
  return context;
};