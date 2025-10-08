import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './Login.tsx'
import Registration from './Registration.tsx'
import ProductList from './ProductList.tsx'
import Cart from './Cart.tsx'
import Checkout from './Checkout.tsx'
import OrderConfirmation from './OrderConfirmation.tsx'
import { CartProvider, useCart } from './CartContext'
import { OrderConfirmationData } from './types'
import styles from './App.module.css'
import { Snackbar, Alert } from '@mui/material'

export interface User {
  email: string,
  token?: string,
  firstName?: string,
  lastName?: string
}

// TODO: add translation
// TODO: add protected routes
// TODO: add named pages for navigation instead of using a flag
// TODO: add loading indicators
// TODO: add order history
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)
  const [orderData, setOrderData] = useState<OrderConfirmationData | null>(null)
  const [showRegistration, setShowRegistration] = useState<boolean>(false)
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
  const { state } = useCart()

  // Check for existing token in localStorage on app initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('userData')
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        // Clear invalid data
        localStorage.removeItem('userData')
      }
    }
  }, [])

  const handleLogin = (loginData: User): void => {
    setUser(loginData)
    setIsLoggedIn(true)
    setShowRegistration(false)
    
    // Save token and user data to localStorage
    localStorage.setItem('userData', JSON.stringify(loginData))
  }

  const handleRegistration = (): void => {
    setShowSnackbar(true)
    setShowRegistration(false)
  }

  const handleBackToLogin = (): void => {
    setShowRegistration(false)
  }

  const handleShowRegistration = (): void => {
    setShowRegistration(true)
  }

  const handleLogout = (): void => {
    setUser(null)
    setIsLoggedIn(false)
    
    // Clear localStorage
    localStorage.removeItem('userData')
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

  // Show login or registration page if not logged in
  if (!isLoggedIn) {
    if (showRegistration) {
      return <Registration onRegistration={handleRegistration} onBackToLogin={handleBackToLogin} />
    }
    return <>
      <Login onLogin={handleLogin} onShowRegistration={handleShowRegistration} />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Registration successful! Welcome to our store.
        </Alert>
      </Snackbar>
    </>    
  }

  // Show main app content if logged in
  return (
    <>
      <div className={styles.appHeader}>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}</span>
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
          <h1>Welcome to Our Store</h1>
        </div>
        
        <ProductList user={user}/>
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
        user={user}
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
