import { useEffect, useState } from 'react'
import { useCart } from './CartContext'
import styles from './ProductList.module.css'
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
    <div className={styles.container}>
      <h2 className={styles.title}>Product Catalog</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          const cartItem = state.items.find(item => item.id === product.id)
          const isInCart = cartItem !== undefined
          
          return (
            <div key={product.id} className={styles.card}>
              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>{formatPrice(product.price)}</p>
                {isInCart && (
                  <p className={styles.inCartIndicator}>
                    In cart: {cartItem.quantity}
                  </p>
                )}
              </div>
              <button 
                className={`${styles.addToCartBtn} ${isInCart ? styles.inCart : ''}`}
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
