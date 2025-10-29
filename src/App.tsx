import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Footer from './components/Footer' 
import AiChatFab from './pages/AiChatFab'
import AiChatWidget from './pages/AiChatWidget'

const App: React.FC = () => {
  return (
    <>
      { <Navbar /> }
      
      <main>
        {/* <Outlet /> là "lỗ hổng" nơi các trang con (HomePage, LoginPage...) sẽ được render */}
        <Outlet /> 
      </main>
      
      { <Footer /> }
      <ScrollRestoration/>
      <AiChatFab/>
      <AiChatWidget/>
    </>
  )
}

export default App