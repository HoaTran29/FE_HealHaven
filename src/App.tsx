import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Footer from './components/Footer' 
import AiChatFab from './pages/AiChatFab'
import AiChatWidget from './pages/AiChatWidget'

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* F1.1: Header & Điều hướng */}
      <Navbar /> 
      
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      
      {/* F1.4: Footer */}
      <Footer />
      
      <ScrollRestoration/>
      
      {/* F1.3: Tiện ích Trợ lý AI */}
      <AiChatFab/>
      <AiChatWidget/>
    </div>
  )
}

export default App