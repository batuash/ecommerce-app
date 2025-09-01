import React from 'react'
import { useCart } from './CartContext'
import './ProductList.css'

interface Product {
  id: number
  name: string
  price: number
}

interface ProductListProps {
  products?: Product[]
}

const defaultProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 },
  { id: 3, name: 'Headphones', price: 199.99 },
  { id: 4, name: 'Tablet', price: 449.99 },
  { id: 5, name: 'Wireless Mouse', price: 29.99 },
  { id: 6, name: 'Keyboard', price: 89.99 },
  { id: 7, name: 'Monitor', price: 299.99 },
  { id: 8, name: 'USB Drive', price: 19.99 },
  { id: 9, name: 'Smart TV', price: 1299.99 },
  { id: 10, name: 'Smart Home Speaker', price: 199.99 },
  { id: 11, name: 'Smart Home Security Camera', price: 299.99 },
  { id: 12, name: 'Smart Home Thermostat', price: 299.99 },
  { id: 13, name: 'Smart Home Light', price: 29.99 },
  { id: 14, name: 'Smart Home Doorbell', price: 299.99 },
]

function ProductList({ products = defaultProducts }: ProductListProps) {
  const { addItem, state } = useCart()
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product Catalog</h2>
      <div className="product-grid">
        {products.map((product) => {
          const cartItem = state.items.find(item => item.id === product.id)
          const isInCart = cartItem !== undefined
          
          return (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                {isInCart && (
                  <p className="in-cart-indicator">
                    In cart: {cartItem.quantity}
                  </p>
                )}
              </div>
              <button 
                className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                onClick={() => handleAddToCart(product)}
              >
                {isInCart ? 'Add More' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductList
