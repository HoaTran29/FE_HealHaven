import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import './AiChatWidget.css';

const AiChatWidget: React.FC = () => {
  const { isChatOpen, closeChat, messages, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isChatOpen) return null;

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="ai-chat-widget">
      <div className="chat-header">
        <span>Trợ lý Healing - Heal Haven</span>
        <button onClick={closeChat} className="close-btn">×</button>
      </div>

      <div className="chat-content" ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role}`}>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input 
          type="text" 
          placeholder="Hãy chia sẻ tâm trạng của bạn..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  );
};

export default AiChatWidget;