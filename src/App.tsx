import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './Login.tsx'
import ProductList from './ProductList.tsx'
import './App.css'

interface User {
  email: string
  password: string
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (loginData: User): void => {
    // In a real app, you would validate credentials with your backend
    console.log('User logged in:', loginData.email)
    setUser(loginData)
    setIsLoggedIn(true)
  }

  const handleLogout = (): void => {
    setUser(null)
    setIsLoggedIn(false)
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  // Show main app content if logged in
  return (
    <>
      <div className="app-header">
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="welcome-section">
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Welcome to Our Store</h1>
        </div>
        
        <ProductList />
      </div>
    </>
  )
}

export default App
