import React from 'react'
import './OrderConfirmation.css'

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
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">Order ID: {orderData.orderId}</p>
        </div>

        <div className="confirmation-content">
          <div className="confirmation-message">
            <p>Thank you for your order, {orderData.shippingInfo.firstName}!</p>
            <p>We've sent a confirmation email to {orderData.shippingInfo.email}</p>
            <p>Your order was placed on {formatDate(orderData.timestamp)}</p>
          </div>

          <div className="order-details">
            <div className="order-items">
              <h3>Order Items</h3>
              {orderData.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Quantity: {item.quantity}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="order-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            <div className="shipping-details">
              <h3>Shipping Address</h3>
              <div className="address-info">
                <p>{orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}</p>
                <p>{orderData.shippingInfo.address}</p>
                <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
                <p>{orderData.shippingInfo.country}</p>
              </div>
            </div>

            <div className="payment-details">
              <h3>Payment Method</h3>
              <div className="payment-info">
                <p>Card ending in {orderData.paymentInfo.cardNumber.slice(-4)}</p>
                <p>{orderData.paymentInfo.cardholderName}</p>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You'll receive an email confirmation shortly</li>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll get a tracking number once your order ships</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>
        </div>

        <div className="confirmation-footer">
          <button className="continue-shopping-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
