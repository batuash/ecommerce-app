import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './Login.tsx'
import ProductList from './ProductList.tsx'
import Cart from './Cart.tsx'
import Checkout from './Checkout.tsx'
import OrderConfirmation from './OrderConfirmation.tsx'
import { CartProvider, useCart } from './CartContext'
import styles from './App.module.css'

interface User {
  email: string
  password: string
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)
  const [orderData, setOrderData] = useState<any>(null)
  const { state } = useCart()

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

  const handleCheckout = (): void => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleOrderComplete = (orderData: any): void => {
    setIsCheckoutOpen(false)
    setOrderData(orderData)
  }

  const handleCloseOrderConfirmation = (): void => {
    setOrderData(null)
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  // Show main app content if logged in
  return (
    <>
      <div className={styles.appHeader}>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
        <div className={styles.cartInfo}>
          <button 
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
          >
            🛒 Cart ({state.itemCount})
          </button>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.welcomeSection}>
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

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCheckout}
      />
      
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />
      
      {orderData && (
        <OrderConfirmation 
          orderData={orderData}
          onClose={handleCloseOrderConfirmation}
        />
      )}
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
