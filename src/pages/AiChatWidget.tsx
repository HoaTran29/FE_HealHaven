import React, { useState, useEffect, useRef } from 'react'
import { useChat } from '../contexts/ChatContext'
import './AiChatWidget.css' // Chúng ta sẽ cập nhật CSS

// --- Định nghĩa "khuôn mẫu" cho tin nhắn ---
interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const AiChatWidget: React.FC = () => {
  const { isChatOpen, closeChat } = useChat();

  // === State cho Form (Ban đầu) ===
  const [feeling, setFeeling] = useState('binh-thuong');
  const [time, setTime] = useState('30-phut');
  const [interest, setInterest] = useState('');
  
  // === State cho Chat ===
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState(''); // Tin nhắn người dùng gõ
  const [isLoading, setIsLoading] = useState(false);
  
  // Dùng để tự động cuộn xuống tin nhắn mới nhất
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // === Xử lý Form ban đầu ===
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // 1. Tạo tin nhắn của người dùng từ form
    const userMessageText = `Cảm xúc: ${feeling}, Thời gian: ${time}, Sở thích: ${interest || 'không có'}`;
    const userMessage: ChatMessage = {
      id: 1,
      sender: 'user',
      text: userMessageText,
    };

    // 2. Giả lập AI trả lời
    let suggestion = '';
    if (interest.toLowerCase().includes('len')) {
      suggestion = 'AI gợi ý: Bạn có vẻ thích đan len! Hãy thử làm một chiếc lót ly (coaster) bằng len.';
    } else if (feeling === 'stress') {
      suggestion = 'AI gợi ý: Khi đang stress, vẽ màu nước chủ đề "thiên nhiên" là một lựa chọn tuyệt vời.';
    } else {
      suggestion = 'AI gợi ý: Bạn hãy thử làm một bông hoa Tulip bằng kẽm nhung!';
    }
    const aiMessage: ChatMessage = {
      id: 2,
      sender: 'ai',
      text: suggestion,
    };
    
    // 3. Cập nhật giao diện sau 1.5s
    setTimeout(() => {
      setMessages([userMessage, aiMessage]); // Thêm 2 tin nhắn vào chat
      setHasStartedChat(true); // Ẩn form, hiện chat
      setIsLoading(false);
    }, 1500);
  };
  
  // === Xử lý các tin nhắn hỏi thêm ===
  const handleFollowUpSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim()) return; // Không gửi tin nhắn rỗng

    // 1. Thêm tin nhắn của người dùng vào
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage(''); // Xóa nội dung trong input
    setIsLoading(true);

    // 2. Giả lập AI trả lời
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Cảm ơn câu hỏi của bạn! Hiện tại tôi chỉ có thể gợi ý 1 lần (đây là demo).',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Đóng chat và reset
  const handleCloseChat = () => {
    closeChat();
    // Reset lại toàn bộ state khi đóng
    setTimeout(() => {
      setHasStartedChat(false);
      setMessages([]);
      setFeeling('binh-thuong');
      setTime('30-phut');
      setInterest('');
    }, 300); // Đợi animation đóng xong
  }
  
  if (!isChatOpen) {
    return null;
  }

  return (
    <div className="ai-chat-widget">
      {/* Header của Chatbox */}
      <div className="chat-header">
        <h3>Trợ lý AI 🤖</h3>
        <button onClick={handleCloseChat} className="chat-close-btn">×</button>
      </div>
      
      {/* Thân của Chatbox */}
      <div className="chat-body" ref={chatBodyRef}>
        
        {/* === Giai đoạn 1: Hiển thị Form === */}
        {!hasStartedChat && (
          <form onSubmit={handleFormSubmit} className="ai-chat-form">
            <p className="chat-greeting">Tôi có thể giúp gì cho bạn?</p>
            {/* Form (giống AiHelperPage) */}
            <div className="form-group">
              <label htmlFor="feeling">Bạn cảm thấy thế nào?</label>
              <select id="feeling" className="form-select" value={feeling} onChange={(e) => setFeeling(e.target.value)}>
                <option value="binh-thuong">Bình thường</option>
                <option value="vui-ve">Vui vẻ</option>
                <option value="stress">Stress</option>
              </select>
            </div>
            {/* ... (Các trường Time và Interest) ... */}
             <div className="form-group">
              <label htmlFor="time">Bạn có bao nhiêu thời gian?</label>
              <select id="time" className="form-select" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="30-phut">Khoảng 30 phút</option>
                <option value="1-tieng">Khoảng 1 tiếng</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="interest">Sở thích (ví dụ: len, vẽ...)</label>
              <input type="text" id="interest" value={interest} onChange={(e) => setInterest(e.target.value)} />
            </div>
            
            {!isLoading && (
              <button type="submit" className="btn btn-primary chat-submit-btn">
                Gợi ý cho tôi
              </button>
            )}
            
            {isLoading && (
              <div className="chat-message ai-thinking">
                <p>AI đang suy nghĩ...</p>
              </div>
            )}
          </form>
        )}
        
        {/* === Giai đoạn 2: Hiển thị Chat === */}
        {hasStartedChat && (
          <div className="message-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender === 'ai' ? 'ai-response' : 'user-response'}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai-thinking">
                <p>...</p> {/* AI đang gõ */}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* === Footer của Chatbox (Khung chat) === */}
      {/* Chỉ hiển thị khung chat khi đã bắt đầu chat */}
{hasStartedChat && (
        <form className="chat-input-area" onSubmit={handleFollowUpSubmit}>
          <input 
            type="text" 
            placeholder="Hỏi thêm điều gì đó..." 
            className="chat-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          {/* Thay thế chữ "Gửi" bằng SVG icon */}
          <button type="submit" className="chat-send-btn" title="Gửi">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z"/>
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}

export default AiChatWidget