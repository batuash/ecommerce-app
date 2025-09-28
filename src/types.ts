// Checkout-related types
export type OrderData = {
    customerEmail: string
    customerName: string
    customerPhone: string
    orderItems: Array<{
        productId: number
        quantity: number
    }>
    shipping: ShippingInfo
    payment: Payment
}

export type OrderConfirmationData = {
    orderId: string
    timestamp: string
    total: number
    orderItems: Array<{
      productId: number
      quantity: number
      totalPrice: number
      productName: string
    }>
    shipping: ShippingInfo
    payment: {
        lastFourDigits: string
        cardholderName: string
    }
}

export enum ShippingMethod {
    STANDARD = 'standard',
    EXPRESS = 'express',
    OVERNIGHT = 'overnight',
    PICKUP = 'pickup',
}

export type ShippingInfo = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    addressLine1: string
    city: string
    state: string
    postalCode: string
    country: string
    method: ShippingMethod
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    BANK_TRANSFER = 'bank_transfer',
    CASH = 'cash',
    CHECK = 'check',
    CRYPTOCURRENCY = 'cryptocurrency',
}

export type PaymentInfo = {
    method: PaymentMethod
    cardNumber: string
    expiryDate: string
    // TODO: add support for CVV
    cvv: string
    cardholderName: string
}

export type Payment = {
    method: PaymentMethod
    lastFourDigits: string
    expiryMonth: string
    expiryYear: string
    billingFirstName: string
    billingLastName: string
    billingAddressLine1: string
    billingCity: string
    billingState: string
    billingPostalCode: string
    billingCountry: string
}
