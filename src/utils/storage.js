// LocalStorage utility functions
// Centralized localStorage management with error handling

const STORAGE_KEYS = {
  USER: 'user',
  FAVORITES: 'favorites',
  CART_ITEMS: (userId) => `cartItems_${userId}`,
};

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed value or null
 */
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

/**
 * Safely set item to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Get current user from localStorage
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  return getStorageItem(STORAGE_KEYS.USER);
};

/**
 * Get user ID from localStorage
 * @returns {string|null} - User ID or null
 */
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.id || null;
};

export { STORAGE_KEYS };
