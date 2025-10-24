import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Footer from './components/Footer' 

const App: React.FC = () => {
  return (
    <>
      { <Navbar /> }
      
      <main>
        {/* <Outlet /> là "lỗ hổng" nơi các trang con (HomePage, LoginPage...) sẽ được render */}
        <Outlet /> 
      </main>
      
      { <Footer /> }
    </>
  )
}

export default App