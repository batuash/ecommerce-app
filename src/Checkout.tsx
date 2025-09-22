import React, { useState } from 'react'
import { useCart, CartState } from './CartContext'
import './Checkout.css'
import { delay } from './utils'

// types
interface CheckoutProps {
    isOpen: boolean
    onClose: () => void
    onOrderComplete: (orderData: OrderData) => void
}

interface ShippingFormProps {
    shippingInfo: ShippingInfo
    errors: Errors
    setShippingInfo: (shippingInfo: ShippingInfo) => void
}

interface PaymentFormProps {
    paymentInfo: PaymentInfo
    errors: Errors
    setPaymentInfo: (paymentInfo: PaymentInfo) => void
}

interface ReviewFormProps {
    state: CartState
    shippingInfo: ShippingInfo
    paymentInfo: PaymentInfo
}

interface CheckoutFooterProps {
    isProcessing: boolean
    handlePlaceOrder: () => void
    setCurrentStep: (step: CurrentStep) => void
    currentStep: CurrentStep
    onClose: () => void
    handleShippingNext: () => void
    handlePaymentNext: () => void
}

interface OrderData {
    orderId: string
    items: Array<{
        id: number
        name: string
        price: number
        quantity: number
    }>
    total: number
    shippingInfo: ShippingInfo
    paymentInfo: PaymentInfo
    timestamp: string
}

interface ShippingInfo {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

interface PaymentInfo {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
}

type CurrentStep = 'shipping' | 'payment' | 'review'

// TODO:adam maybe add a more precise type for the errors
type Errors = Record<string, string>

// components
const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, onOrderComplete }) => {
    const { state, clearCart } = useCart()
    const [currentStep, setCurrentStep] = useState<CurrentStep>('shipping')
    const [isProcessing, setIsProcessing] = useState(false)
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    })
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
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
        // Simulate API call
        await delay(2000)

        const orderData: OrderData = {
            orderId: `ORD-${Date.now()}`,
            items: state.items,
            total: state.total,
            shippingInfo,
            paymentInfo,
            timestamp: new Date().toISOString()
        }

        clearCart()
        onOrderComplete(orderData)
        setIsProcessing(false)
    }

    if (!isOpen) return null

    // TODO:adam break down component to smaller components and files
    return (
        <div className="checkout-overlay" onClick={onClose}>
            <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-header">
                    <h2>Checkout</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="checkout-steps">
                    <div className={`step ${currentStep === 'shipping' ? 'active' : ''} ${currentStep === 'payment' || currentStep === 'review' ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Shipping</span>
                    </div>
                    <div className={`step ${currentStep === 'payment' ? 'active' : ''} ${currentStep === 'review' ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Payment</span>
                    </div>
                    <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Review</span>
                    </div>
                </div>

                <div className="checkout-content">
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
    return <div className="shipping-form">
        <h3>Shipping Information</h3>
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                    type="text"
                    id="firstName"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                    type="text"
                    id="lastName"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
                type="email"
                id="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
                type="text"
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-row">
            <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                    type="text"
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                    type="text"
                    id="state"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                    type="text"
                    id="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
                id="country"
                value={shippingInfo.country}
                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
            >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
            </select>
        </div>
    </div>
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentInfo, setPaymentInfo, errors }) => {
    return <div className="payment-form">
        <h3>Payment Information</h3>
        <div className="form-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <input
                type="text"
                id="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.cardNumber ? 'error' : ''}
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name *</label>
            <input
                type="text"
                id="cardholderName"
                value={paymentInfo.cardholderName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                className={errors.cardholderName ? 'error' : ''}
            />
            {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
        </div>

        <div className="form-row">
            <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                    type="text"
                    id="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                    type="text"
                    id="cvv"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
        </div>
    </div>
}

const ReviewForm: React.FC<ReviewFormProps> = ({ state, shippingInfo, paymentInfo }) => {
    return <div className="review-section">
        <h3>Review Your Order</h3>

        <div className="order-summary">
            <h4>Order Items</h4>
            {state.items.map((item) => (
                <div key={item.id} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
            ))}

            <div className="order-total">
                <span>Total: {formatPrice(state.total)}</span>
            </div>
        </div>

        <div className="shipping-summary">
            <h4>Shipping Address</h4>
            <p>
                {shippingInfo.firstName} {shippingInfo.lastName}<br />
                {shippingInfo.address}<br />
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                {shippingInfo.country}
            </p>
        </div>

        <div className="payment-summary">
            <h4>Payment Method</h4>
            <p>
                Card ending in {paymentInfo.cardNumber.slice(-4)}<br />
                {paymentInfo.cardholderName}
            </p>
        </div>
    </div>
}

const CheckoutFooter: React.FC<CheckoutFooterProps> = ({ isProcessing, currentStep, handlePlaceOrder, setCurrentStep, onClose, handleShippingNext, handlePaymentNext }) => {
    return <div className="checkout-footer">
        <div className="checkout-actions">
            {currentStep === 'shipping' && (
                <>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="next-btn" onClick={handleShippingNext}>
                        Continue to Payment
                    </button>
                </>
            )}

            {currentStep === 'payment' && (
                <>
                    <button className="back-btn" onClick={() => setCurrentStep('shipping')}>
                        Back to Shipping
                    </button>
                    <button className="next-btn" onClick={handlePaymentNext}>
                        Review Order
                    </button>
                </>
            )}

            {currentStep === 'review' && (
                <>
                    <button className="back-btn" onClick={() => setCurrentStep('payment')}>
                        Back to Payment
                    </button>
                    <button
                        className="place-order-btn"
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
    if (!shippingInfo.address.trim()) errors.address = 'Address is required'
    if (!shippingInfo.city.trim()) errors.city = 'City is required'
    if (!shippingInfo.state.trim()) errors.state = 'State is required'
    if (!shippingInfo.zipCode.trim()) errors.zipCode = 'ZIP code is required'
    else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode)) errors.zipCode = 'Invalid ZIP code format'

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

export default Checkout
