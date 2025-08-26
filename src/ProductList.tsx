import React from 'react'
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
  { id: 8, name: 'USB Drive', price: 19.99 }
]

function ProductList({ products = defaultProducts }: ProductListProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product Catalog</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>
            <button className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
