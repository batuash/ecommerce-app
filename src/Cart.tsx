import React from 'react'
import { useCart } from './CartContext'
import styles from './Cart.module.css'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart()

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Shopping Cart ({state.itemCount} items)</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button className={styles.continueShopping} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {state.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className={styles.itemControls}>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className={styles.itemTotal}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total:</span>
                <span className={styles.totalAmount}>{formatPrice(state.total)}</span>
              </div>
              
              <div className={styles.actions}>
                <button className={styles.clearCartBtn} onClick={clearCart}>
                  Clear Cart
                </button>
                <button className={styles.checkoutBtn} onClick={onCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
