import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './style.css'
import { BrowserRouter } from 'react-router-dom'
import NavProvider from './NavProvider.jsx'
import CartProvider from './CartProvider.jsx'
import FavoriteProvider from './FavoriteProvider.jsx'
import ReviewProvider from './ReviewProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NavProvider>
      <CartProvider>
        <FavoriteProvider>
          <ReviewProvider>
            <App />
          </ReviewProvider>
        </FavoriteProvider>
      </CartProvider>
    </NavProvider>
  </BrowserRouter>
);
