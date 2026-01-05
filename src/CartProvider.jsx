import PropTypes from 'prop-types';
import { createContext, useState, useEffect, useCallback } from 'react';
import CartContext from './CartContext';
import { getUserId, getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { calculateDiscountedPrice as calcDiscountedPrice } from '../utils/price';

const CartProvider = ({ children }) => {
    // Initialize cart items from localStorage
    const [cartItems, setCartItems] = useState(() => {
        const userId = getUserId();
        if (userId) {
            const savedCartItems = getStorageItem(STORAGE_KEYS.CART_ITEMS(userId));
            return Array.isArray(savedCartItems) ? savedCartItems : [];
        }
        return [];
    });

    // Persist cart items to localStorage
    useEffect(() => {
        const userId = getUserId();
        if (userId && cartItems.length >= 0) {
            setStorageItem(STORAGE_KEYS.CART_ITEMS(userId), cartItems);
        }
    }, [cartItems]);

    const [isCartOpen, setIsCartOpen] = useState(false);

    /**
     * Check if two cart items match (same product, color, and size)
     * @param {Object} item1 - First cart item
     * @param {Object} item2 - Second cart item
     * @returns {boolean} - Whether items match
     */
    const itemsMatch = useCallback((item1, item2) => {
        const sameId = item1.id === item2.id;
        const sameColor = item1.selectedColor?.code === item2.selectedColor?.code;
        const sameSize = item1.selectedSize === item2.selectedSize;
        const noColorOrSize = !item1.selectedColor && !item1.selectedSize && 
                             !item2.selectedColor && !item2.selectedSize;

        return noColorOrSize ? sameId : sameId && sameColor && sameSize;
    }, []);

    /**
     * Find matching cart item
     * @param {Object} product - Product to match
     * @returns {Object|undefined} - Matching cart item or undefined
     */
    const findMatchingCartItem = useCallback((product) => {
        return cartItems.find((cartItem) => 
            itemsMatch(cartItem.product, product)
        );
    }, [cartItems, itemsMatch]);

    /**
     * Calculate discounted price for an item
     * @param {Object} item - Product item
     * @returns {string} - Formatted price string
     */
    const calculateDiscountedPrice = useCallback((item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) {
            return '0.00';
        }
        const discounted = calcDiscountedPrice(price, item.discount);
        return discounted.toFixed(2);
    }, []);

    /**
     * Add item to cart
     * @param {Object} item - Product item to add
     */
    const addToCart = useCallback((item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot add to cart.");
            return;
        }

        const itemPrice = calculateDiscountedPrice(item);
        const matchingItem = findMatchingCartItem(item);

        if (matchingItem) {
            setCartItems((prevItems) =>
                prevItems.map((cartItem) =>
                    itemsMatch(cartItem.product, item)
                        ? {
                              ...cartItem,
                              quantity: cartItem.quantity + 1,
                              product: { ...cartItem.product, price: itemPrice },
                          }
                        : cartItem
                )
            );
        } else {
            setCartItems((prevItems) => [
                ...prevItems,
                { product: { ...item, price: itemPrice }, quantity: 1 },
            ]);
        }

        setIsCartOpen(true);
        setTimeout(() => {
            setIsCartOpen(false);
        }, 3000);
    }, [findMatchingCartItem, itemsMatch, calculateDiscountedPrice]);

    /**
     * Get total number of items in cart
     * @returns {number} - Total cart quantity
     */
    const getCartQuantity = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    /**
     * Update cart item quantity (increment)
     * @param {Object} item - Cart item to update
     */
    const updateCart = useCallback((item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot update cart.");
            return;
        }

        const matchingItem = findMatchingCartItem(item.product);

        if (matchingItem) {
            setCartItems((prevItems) =>
                prevItems.map((cartItem) =>
                    itemsMatch(cartItem.product, item.product)
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems((prevItems) => [
                ...prevItems,
                { product: item.product, quantity: 1 },
            ]);
        }
    }, [findMatchingCartItem, itemsMatch]);

    /**
     * Remove item from cart or decrease quantity
     * @param {Object} item - Cart item to remove
     */
    const removeFromCart = useCallback((item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot remove from cart.");
            return;
        }

        const matchingItem = findMatchingCartItem(item.product);

        if (matchingItem) {
            if (matchingItem.quantity === 1) {
                setCartItems((prevItems) =>
                    prevItems.filter(
                        (cartItem) => !itemsMatch(cartItem.product, item.product)
                    )
                );
            } else {
                setCartItems((prevItems) =>
                    prevItems.map((cartItem) =>
                        itemsMatch(cartItem.product, item.product)
                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                            : cartItem
                    )
                );
            }
        }
    }, [findMatchingCartItem, itemsMatch]);

    /**
     * Clear all items from cart
     */
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    /**
     * Calculate subtotal for a cart item
     * @param {Object} item - Cart item
     * @returns {number} - Subtotal
     */
    const getSubTotal = useCallback((item) => {
        const price = parseFloat(item.product.price) || 0;
        return price * item.quantity;
    }, []);

    /**
     * Calculate total cart value
     * @returns {number} - Total cart value
     */
    const getCartTotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + getSubTotal(item), 0);
    }, [cartItems, getSubTotal]);

    /**
     * Handle cart mouse enter
     */
    const handleCartMouseEnter = useCallback(() => {
        setIsCartOpen(true);
    }, []);

    /**
     * Handle cart mouse leave
     */
    const handleCartMouseLeave = useCallback(() => {
        setIsCartOpen(false);
    }, []);
  
      return (
          <CartContext.Provider
              value={{
                  cartItems,
                  addToCart,
                  getCartQuantity,
                  removeFromCart,
                  clearCart,
                  updateCart,
                  getSubTotal,
                  getCartTotal,
                  isCartOpen, 
                  calculateDiscountedPrice
              }}>
                {children}
            </CartContext.Provider>
    )
}
CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CartProvider