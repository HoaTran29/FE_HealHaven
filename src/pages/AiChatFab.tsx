import React from 'react'
import { useChat } from '../contexts/ChatContext'
import './AiChatFab.css'

const AiChatFab: React.FC = () => {
  const { isChatOpen, openChat } = useChat();

  // Nếu chat đang mở, ẩn nút này đi
  if (isChatOpen) {
    return null;
  }

  return (
    <button className="ai-chat-fab" onClick={openChat}>
      {/* Đây là mascot 🤖, bạn có thể thay bằng thẻ <img> */}
      🤖
    </button>
  )
}

export default AiChatFab