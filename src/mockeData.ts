import { PaymentMethod, ShippingMethod } from "./types"

export const mockedShippingInfo = {
    method: ShippingMethod.STANDARD,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
    addressLine1: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    country: 'USA'
}

export const mockedPaymentInfo = {
    method: PaymentMethod.CREDIT_CARD,
    cardNumber: "1234567890123456",
    expiryDate: "12/25",
    cvv: "123",
    cardholderName: "John Doe"
}