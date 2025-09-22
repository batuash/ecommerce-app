import React, { useState } from 'react'
import { useCart, CartState } from './CartContext'
import styles from './Checkout.module.css'
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
            <label htmlFor='address'>Address *</label>
            <input
                type='text'
                id='address'
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className={errors.address ? styles.error : ''}
            />
            {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
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
                <label htmlFor='zipCode'>ZIP Code *</label>
                <input
                    type='text'
                    id='zipCode'
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className={errors.zipCode ? styles.error : ''}
                />
                {errors.zipCode && <span className={styles.errorMessage}>{errors.zipCode}</span>}
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
    </div>
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentInfo, setPaymentInfo, errors }) => {
    return <div className={styles.paymentForm}>
        <h3>Payment Information</h3>
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
                {shippingInfo.address}<br />
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
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
