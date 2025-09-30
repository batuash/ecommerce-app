# Ecommerce App

A modern, full-featured ecommerce application built with React, TypeScript, and Vite. This application provides a complete shopping experience with user authentication, product browsing, shopping cart management, and secure checkout functionality.

## 🚀 Features

### Core Functionality
- **User Authentication**: Login system with email/password validation
- **Product Catalog**: Browse and search through available products
- **Shopping Cart**: Add/remove items, update quantities, view cart contents
- **Checkout Process**: Complete order flow with shipping and payment information
- **Order Confirmation**: Order summary and confirmation system

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Context**: State management for cart and user data
- **CSS Modules**: Scoped styling for maintainable CSS
- **Responsive Design**: Mobile-friendly interface
- **Modern React**: Built with React 19 and latest best practices

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, TypeScript 5.9.2
- **Build Tool**: Vite 7.1.2
- **Styling**: CSS Modules
- **Linting**: ESLint with React-specific rules
- **Development**: Hot reload, TypeScript compilation

## 📦 Project Structure

```
src/
├── App.tsx                 # Main application component
├── App.module.css         # Global app styles
├── Cart.tsx              # Shopping cart component
├── Cart.module.css       # Cart-specific styles
├── CartContext.tsx       # Cart state management
├── Checkout.tsx          # Checkout process component
├── Checkout.module.css   # Checkout styles
├── Login.tsx             # User authentication
├── Login.module.css      # Login styles
├── OrderConfirmation.tsx # Order completion component
├── OrderConfirmation.module.css
├── ProductList.tsx       # Product catalog
├── ProductList.module.css
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions
├── config.ts             # Application configuration
└── mockeData.ts          # Mock data for development
```

## 🌐 Live Demo

Experience the application live at: **[https://ecommerce-app-2gxe.onrender.com](https://ecommerce-app-2gxe.onrender.com)**

The demo showcases all features including user authentication, product browsing, shopping cart management, and the complete checkout process.

**Note:** The demo may take up to a minute to load initially as the hosting service spins up from sleep mode.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎯 Usage

### User Flow
1. **Login**: Enter email and password to access the store
2. **Browse Products**: View the product catalog with prices and descriptions
3. **Add to Cart**: Click "Add to Cart" to add items to your shopping cart
4. **Manage Cart**: View cart contents, update quantities, or remove items
5. **Checkout**: Proceed to checkout with shipping and payment information
6. **Order Confirmation**: Review and confirm your order

### Key Components

- **Login Component**: Handles user authentication
- **ProductList Component**: Displays product catalog with add-to-cart functionality
- **Cart Component**: Shopping cart with item management
- **Checkout Component**: Order processing with form validation
- **OrderConfirmation Component**: Order summary and confirmation

## 🔧 Configuration

The application uses a configuration file (`src/config.ts`) to manage:
- API endpoints
- Application settings
- Environment-specific configurations

## 📝 Development Notes

### State Management
- Cart state is managed using React Context API
- User authentication state is handled at the App level
- Order data flows through the checkout process

### Type Safety
- Comprehensive TypeScript types for all data structures
- Type-safe props and state management
- Enum definitions for shipping and payment methods

### Styling
- CSS Modules for component-scoped styling
- Responsive design principles
- Modern CSS features and best practices

## 🚧 Future Enhancements

- [ ] Add translation support (i18n)
- [ ] Implement proper authentication backend
- [ ] Add product search and filtering
- [ ] Implement user profiles and order history
- [ ] Add payment gateway integration
- [ ] Implement admin dashboard
- [ ] Add product reviews and ratings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
