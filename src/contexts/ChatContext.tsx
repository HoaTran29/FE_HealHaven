import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Định nghĩa cấu trúc Workshop để AI có dữ liệu tư vấn (F1.3)
interface Workshop {
  id: string;
  name: string;
  mood: string[]; // Các từ khóa tâm trạng: stress, creative, lonely...
  description: string;
}

// Dữ liệu mẫu (Sau này bạn có thể fetch từ API)
const mockWorkshops: Workshop[] = [
  { id: '1', name: 'Đan len chữa lành', mood: ['stress', 'kiên nhẫn'], description: 'Giúp tĩnh tâm qua từng mũi đan.' },
  { id: '2', name: 'Vẽ màu nước', mood: ['creative', 'vui vẻ'], description: 'Tự do sáng tạo cùng màu sắc.' },
  { id: '3', name: 'Làm nến thơm', mood: ['peaceful', 'thư giãn'], description: 'Tận hưởng mùi hương dịu nhẹ.' }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface IChatContext {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  messages: Message[];
  sendMessage: (text: string) => void; // Logic xử lý tin nhắn và gợi ý
}

const ChatContext = createContext<IChatContext | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào bạn, Heal Haven có thể giúp gì cho tâm trạng của bạn hôm nay?' }
  ]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  // 2. Logic xử lý tin nhắn và gợi ý Workshop (F1.3)
  const sendMessage = (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    // Giả lập AI tìm kiếm workshop dựa trên từ khóa trong tin nhắn
    setTimeout(() => {
      const foundWorkshop = mockWorkshops.find(ws => 
        ws.mood.some(m => text.toLowerCase().includes(m))
      );

      let aiResponse = "Mình luôn lắng nghe bạn. Bạn có muốn thử một hoạt động handmade để thấy thoải mái hơn không?";
      
      if (foundWorkshop) {
        aiResponse = `Nghe vẻ bạn đang cần sự ${foundWorkshop.mood[0]}. Mình gợi ý workshop "${foundWorkshop.name}": ${foundWorkshop.description}`;
      }

      const assistantMsg: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMsg]);
    }, 800);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, openChat, closeChat, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat phải được dùng bên trong ChatProvider');
  }
  return context;
};