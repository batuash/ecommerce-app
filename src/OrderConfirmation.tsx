import React from 'react'
import styles from './OrderConfirmation.module.css'

interface OrderData {
  orderId: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  total: number
  shippingInfo: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentInfo: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
  }
  timestamp: string
}

interface OrderConfirmationProps {
  orderData: OrderData
  onClose: () => void
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderData, onClose }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.successIcon}>✓</div>
          <h2>Order Confirmed!</h2>
          <p className={styles.orderId}>Order ID: {orderData.orderId}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.message}>
            <p>Thank you for your order, {orderData.shippingInfo.firstName}!</p>
            <p>We've sent a confirmation email to {orderData.shippingInfo.email}</p>
            <p>Your order was placed on {formatDate(orderData.timestamp)}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.orderItems}>
              <h3>Order Items</h3>
              {orderData.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className={styles.orderTotal}>
                <span className={styles.totalLabel}>Total:</span>
                <span className={styles.totalAmount}>{formatPrice(orderData.total)}</span>
              </div>
            </div>

            <div className={styles.shippingDetails}>
              <h3>Shipping Address</h3>
              <div className={styles.addressInfo}>
                <p>{orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}</p>
                <p>{orderData.shippingInfo.address}</p>
                <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
                <p>{orderData.shippingInfo.country}</p>
              </div>
            </div>

            <div className={styles.paymentDetails}>
              <h3>Payment Method</h3>
              <div className={styles.paymentInfo}>
                <p>Card ending in {orderData.paymentInfo.cardNumber.slice(-4)}</p>
                <p>{orderData.paymentInfo.cardholderName}</p>
              </div>
            </div>
          </div>

          <div className={styles.nextSteps}>
            <h3>What's Next?</h3>
            <ul>
              <li>You'll receive an email confirmation shortly</li>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll get a tracking number once your order ships</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.continueShoppingBtn} onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
