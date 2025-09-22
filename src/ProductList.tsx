import { useEffect, useState } from 'react'
import { useCart } from './CartContext'
import './ProductList.css'
import config from './config'

interface Product {
  id: number
  name: string
  price: number
}

function ProductList() {
  const { addItem, state } = useCart()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${config.apiBaseUrl}/products`)
      const data = await response.json()
      setProducts(data)
    }
    fetchProducts()
  }, [products])
  
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
