// API Configuration
// Centralized API endpoint management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://buy-now-jocc.onrender.com';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  BRANDS: `${API_BASE_URL}/brands`,
  BRAND_BY_ID: (id) => `${API_BASE_URL}/brands/${id}`,
  ORDERS: `${API_BASE_URL}/orders`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  USERS: `${API_BASE_URL}/users`,
};

export default API_ENDPOINTS;
