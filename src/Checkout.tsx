import React, { useState } from 'react'
import { useCart, CartState } from './CartContext'
import styles from './Checkout.module.css'
import config from './config'
import {
  OrderData,
  ShippingMethod,
  ShippingInfo,
  PaymentMethod,
  PaymentInfo,
  Payment,
  OrderConfirmationData
} from './types'
import { User } from './App'

// types
export type CurrentStep = 'shipping' | 'payment' | 'review'

export type CheckoutFooterProps = {
    isProcessing: boolean
    handlePlaceOrder: () => void
    setCurrentStep: (step: CurrentStep) => void
    currentStep: CurrentStep
    onClose: () => void
    handleShippingNext: () => void
    handlePaymentNext: () => void
}

export type Errors = Record<string, string>

export type CheckoutProps = {
    isOpen: boolean
    onClose: () => void
    onOrderComplete: (orderData: OrderConfirmationData) => void
    user: User | null
}

export type ShippingFormProps = {
    shippingInfo: ShippingInfo
    errors: Errors
    setShippingInfo: (shippingInfo: ShippingInfo) => void
}

export type PaymentFormProps = {
    paymentInfo: PaymentInfo
    errors: Errors
    setPaymentInfo: (paymentInfo: PaymentInfo) => void
}

export type ReviewFormProps = {
    state: CartState
    shippingInfo: ShippingInfo
    paymentInfo: PaymentInfo
}

// components
const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, onOrderComplete, user }) => {
    const { state, clearCart } = useCart()
    const [currentStep, setCurrentStep] = useState<CurrentStep>('shipping')
    const [isProcessing, setIsProcessing] = useState(false)
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        method: ShippingMethod.STANDARD
    })
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        method: PaymentMethod.CREDIT_CARD,
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    })

    const [errors, setErrors] = useState<Errors>({})

    const handleShippingNext = () => {
        const errors = validateShippingInfo(shippingInfo)
        const hasErrors = Object.keys(errors).length > 0

        if (hasErrors) {
            setErrors(errors)
        } else {
            setCurrentStep('payment')
        }
    }

    const handlePaymentNext = () => {
        const errors = validatePaymentInfo(paymentInfo)
        const hasErrors = Object.keys(errors).length > 0

        if (hasErrors) {
            setErrors(errors)
        } else {
            setCurrentStep('review')
        }
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true)
        const orderData = getOrderData(state, shippingInfo, paymentInfo)
        const response =await fetch(`${config.apiBaseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(orderData)
        })
        const { id, createdAt, totalAmount, orderItems } = await response.json()
        const orderConfirmationData = {
            orderId: id,
            timestamp: createdAt,
            total: totalAmount,
            orderItems,
            shipping: orderData.shipping,
            payment: {
                lastFourDigits: orderData.payment.lastFourDigits,
                cardholderName: paymentInfo.cardholderName
            }
        }
        
        clearCart()
        setIsProcessing(false)
        onOrderComplete(orderConfirmationData)
    }

    if (!isOpen) return null

    // TODO:adam break down component to smaller components and files
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Checkout</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.steps}>
                    <div className={`${styles.step} ${currentStep === 'shipping' ? styles.active : ''} ${currentStep === 'payment' || currentStep === 'review' ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span className={styles.stepLabel}>Shipping</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === 'payment' ? styles.active : ''} ${currentStep === 'review' ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span className={styles.stepLabel}>Payment</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === 'review' ? styles.active : ''}`}>
                        <span className={styles.stepNumber}>3</span>
                        <span className={styles.stepLabel}>Review</span>
                    </div>
                </div>

                <div className={styles.content}>
                    {currentStep === 'shipping' && (
                        <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} errors={errors} />
                    )}

                    {currentStep === 'payment' && (
                        <PaymentForm paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} errors={errors} />
                    )}

                    {currentStep === 'review' && (
                        <ReviewForm state={state} shippingInfo={shippingInfo} paymentInfo={paymentInfo} />
                    )}
                </div>

                <CheckoutFooter 
                    isProcessing={isProcessing}
                    currentStep={currentStep}
                    handlePlaceOrder={handlePlaceOrder}
                    setCurrentStep={setCurrentStep}
                    onClose={onClose}
                    handleShippingNext={handleShippingNext}
                    handlePaymentNext={handlePaymentNext} 
                />
            </div>
        </div>
    )
}

const ShippingForm: React.FC<ShippingFormProps> = ({ shippingInfo, setShippingInfo, errors }) => {
    return <div className={styles.shippingForm}>
        <h3>Shipping Information</h3>
        <div className={styles.formRow}>
            <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                    type="text"
                    id="firstName"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    className={errors.firstName ? styles.error : ''}
                />
                {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor='lastName'>Last Name *</label>
                <input
                    type='text'
                    id='lastName'
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    className={errors.lastName ? styles.error : ''}
                />
                {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
            </div>
        </div>

        <div className={styles.formGroup}>
            <label htmlFor='email'>Email *</label>
            <input
                type='email'
                id='email'
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                className={errors.email ? styles.error : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
            <label htmlFor='phone'>Phone Number *</label>
            <input
                type='tel'
                id='phone'
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                className={errors.phone ? styles.error : ''}
            />
            {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>

        <div className={styles.formGroup}>
            <label htmlFor='addressLine1'>Address *</label>
            <input
                type='text'
                id='addressLine1'
                value={shippingInfo.addressLine1}
                onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })}
                className={errors.addressLine1 ? styles.error : ''}
            />
            {errors.addressLine1 && <span className={styles.errorMessage}>{errors.addressLine1}</span>}
        </div>

        <div className={styles.formRow}>
            <div className={styles.formGroup}>
                <label htmlFor='city'>City *</label>
                <input
                    type='text'
                    id='city'
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className={errors.city ? styles.error : ''}
                />
                {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor='state'>State *</label>
                <input
                    type='text'
                    id='state'
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className={errors.state ? styles.error : ''}
                />
                {errors.state && <span className={styles.errorMessage}>{errors.state}</span>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor='postalCode'>Postal Code *</label>
                <input
                    type='text'
                    id='postalCode'
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    className={errors.postalCode ? styles.error : ''}
                />
                {errors.postalCode && <span className={styles.errorMessage}>{errors.postalCode}</span>}
            </div>
        </div>

        <div className={styles.formGroup}>
            <label htmlFor='country'>Country</label>
            <select
                id='country'
                value={shippingInfo.country}
                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
            >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
            </select>
        </div>

        <div className={styles.formGroup}>
            <label htmlFor='method'>Shipping Method</label>
            <select
                id='method'
                value={shippingInfo.method}
                onChange={(e) => setShippingInfo({ ...shippingInfo, method: e.target.value as ShippingMethod })}
            >
                <option value={ShippingMethod.STANDARD}>Standard</option>
                <option value={ShippingMethod.EXPRESS}>Express</option>
                <option value={ShippingMethod.OVERNIGHT}>Overnight</option>
                <option value={ShippingMethod.PICKUP}>Pickup</option>
            </select>
        </div>
    </div>
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentInfo, setPaymentInfo, errors }) => {
    return <div className={styles.paymentForm}>
        <h3>Payment Information</h3>
        <div className={styles.formGroup}>
            <label htmlFor='method'>PaymentMethod</label>
            <select
                id='method'
                value={paymentInfo.method}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, method: e.target.value as PaymentMethod })}
            >
                <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
                <option value={PaymentMethod.DEBIT_CARD}>Debit Card</option>
                <option value={PaymentMethod.PAYPAL}>Paypal</option>
                <option value={PaymentMethod.STRIPE}>Stripe</option>
                <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                <option value={PaymentMethod.CASH}>Cash</option>
                <option value={PaymentMethod.CHECK}>Check</option>
                <option value={PaymentMethod.CRYPTOCURRENCY}>Cryptocurrency</option>
            </select>
        </div>
        <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Card Number *</label>
            <input
                type="text"
                id="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.cardNumber ? styles.error : ''}
            />
            {errors.cardNumber && <span className={styles.errorMessage}>{errors.cardNumber}</span>}
        </div>

        <div className={styles.formGroup}>
            <label htmlFor="cardholderName">Cardholder Name *</label>
            <input
                type="text"
                id="cardholderName"
                value={paymentInfo.cardholderName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                className={errors.cardholderName ? styles.error : ''}
            />
            {errors.cardholderName && <span className={styles.errorMessage}>{errors.cardholderName}</span>}
        </div>

        <div className={styles.formRow}>
            <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                    type="text"
                    id="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={errors.expiryDate ? styles.error : ''}
                />
                {errors.expiryDate && <span className={styles.errorMessage}>{errors.expiryDate}</span>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV *</label>
                <input
                    type="text"
                    id="cvv"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? styles.error : ''}
                />
                {errors.cvv && <span className={styles.errorMessage}>{errors.cvv}</span>}
            </div>
        </div>
    </div>
}

const ReviewForm: React.FC<ReviewFormProps> = ({ state, shippingInfo, paymentInfo }) => {
    return <div className={styles.reviewSection}>
        <h3>Review Your Order</h3>

        <div className={styles.orderSummary}>
            <h4>Order Items</h4>
            {state.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                    <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
            ))}

            <div className={styles.orderTotal}>
                <span>Total: {formatPrice(state.total)}</span>
            </div>
        </div>

        <div className={styles.shippingSummary}>
            <h4>Shipping Address</h4>
            <p>
                {shippingInfo.firstName} {shippingInfo.lastName}<br />
                {shippingInfo.addressLine1}<br />
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}<br />
                {shippingInfo.country}
            </p>
        </div>

        <div className={styles.paymentSummary}>
            <h4>Payment Method</h4>
            <p>
                Card ending in {paymentInfo.cardNumber.slice(-4)}<br />
                {paymentInfo.cardholderName}
            </p>
        </div>
    </div>
}

const CheckoutFooter: React.FC<CheckoutFooterProps> = ({ isProcessing, currentStep, handlePlaceOrder, setCurrentStep, onClose, handleShippingNext, handlePaymentNext }) => {
    return <div className={styles.footer}>
        <div className={styles.actions}>
            {currentStep === 'shipping' && (
                <>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.nextBtn} onClick={handleShippingNext}>
                        Continue to Payment
                    </button>
                </>
            )}

            {currentStep === 'payment' && (
                <>
                    <button className={styles.backBtn} onClick={() => setCurrentStep('shipping')}>
                        Back to Shipping
                    </button>
                    <button className={styles.nextBtn} onClick={handlePaymentNext}>
                        Review Order
                    </button>
                </>
            )}

            {currentStep === 'review' && (
                <>
                    <button className={styles.backBtn} onClick={() => setCurrentStep('payment')}>
                        Back to Payment
                    </button>
                    <button
                        className={styles.placeOrderBtn}
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                </>
            )}
        </div>
    </div>
}


// helper methods
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price)
}

const validateShippingInfo = (shippingInfo: ShippingInfo): Errors => {
    const errors: Errors = {}

    if (!shippingInfo.firstName.trim()) errors.firstName = 'First name is required'
    if (!shippingInfo.lastName.trim()) errors.lastName = 'Last name is required'
    if (!shippingInfo.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) errors.email = 'Email is invalid'
    if (!shippingInfo.phone.trim()) errors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(shippingInfo.phone)) errors.phone = 'Invalid phone number format'
    if (!shippingInfo.addressLine1.trim()) errors.addressLine1 = 'Address is required'
    if (!shippingInfo.city.trim()) errors.city = 'City is required'
    if (!shippingInfo.state.trim()) errors.state = 'State is required'
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'Postal code is required'
    else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.postalCode)) errors.postalCode = 'Invalid postal code format'

    return errors
}

const validatePaymentInfo = (paymentInfo: PaymentInfo): Errors => {
    const errors: Errors = {}

    if (!paymentInfo.cardNumber.trim()) errors.cardNumber = 'Card number is required'
    else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Invalid card number format'
    }
    if (!paymentInfo.expiryDate.trim()) errors.expiryDate = 'Expiry date is required'
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date format (MM/YY)'
    }
    if (!paymentInfo.cvv.trim()) errors.cvv = 'CVV is required'
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) errors.cvv = 'Invalid CVV format'
    if (!paymentInfo.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required'

    return errors
}

const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
        return parts.join(' ')
    } else {
        return v
    }
}

const getPayment = (paymentInfo: PaymentInfo, shippingInfo: ShippingInfo): Payment => {
    return {
        method: paymentInfo.method,
        lastFourDigits: paymentInfo.cardNumber.slice(-4),
        expiryMonth: paymentInfo.expiryDate.split('/')[0],
        expiryYear: paymentInfo.expiryDate.split('/')[1],
        billingFirstName: shippingInfo.firstName,
        billingLastName: shippingInfo.lastName,
        billingAddressLine1: shippingInfo.addressLine1,
        billingCity: shippingInfo.city,
        billingState: shippingInfo.state,
        billingPostalCode: shippingInfo.postalCode,
        billingCountry: shippingInfo.country
    }
}

const getOrderData = (state: CartState, shippingInfo: ShippingInfo, paymentInfo: PaymentInfo): OrderData => {
        const orderItems = state.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity
        }))
        const payment = getPayment(paymentInfo, shippingInfo)

        return  {
            customerEmail: shippingInfo.email,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            customerPhone: shippingInfo.phone,
            orderItems,
            shipping: shippingInfo,
            payment,
        }
}

export default Checkout

