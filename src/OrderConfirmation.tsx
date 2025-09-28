import React from 'react'
import styles from './OrderConfirmation.module.css'
import { OrderConfirmationData } from './types'

interface OrderConfirmationProps {
  orderData: OrderConfirmationData
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
            <p>Thank you for your order, {orderData.shipping.firstName}!</p>
            <p>We've sent a confirmation email to {orderData.shipping.email}</p>
            <p>Your order was placed on {formatDate(orderData.timestamp)}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.orderItems}>
              <h3>Order Items</h3>
              {orderData.orderItems.map((item) => (
                <div key={item.productId} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.productName}</span>
                    <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>{formatPrice(item.totalPrice)}</span>
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
                <p>{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
                <p>{orderData.shipping.addressLine1}</p>
                <p>{orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.postalCode}</p>
                <p>{orderData.shipping.country}</p>
              </div>
            </div>

            <div className={styles.paymentDetails}>
              <h3>Payment Method</h3>
              <div className={styles.paymentInfo}>
                <p>Card ending in {orderData.payment.lastFourDigits}</p>
                <p>{orderData.payment.cardholderName}</p>
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
