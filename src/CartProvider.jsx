import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
import CartContext from './CartContext';
const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : null;
        if (userId) {
            const savedCartItems = localStorage.getItem(`cartItems_${userId}`);
            const parsedCartItems = savedCartItems ? JSON.parse(savedCartItems) : [];
            return Array.isArray(parsedCartItems) ? parsedCartItems : [];
        }
        return [];
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : null;
        if (userId) {
            localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.id : null;
    };

    const [isCartOpen, setIsCartOpen] = useState(false);

    const calculateDiscountedPrice = (item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) {
          return '0.00';
        }
        if (item.discount) {
          return (price - (price * item.discount / 100)).toFixed(2);
        }
        return price.toFixed(2);
      };

    

    const addToCart = (item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot add to cart.");
            return;
        }
    
        console.log("Cart Items: ", cartItems);
        console.log("Adding to cart:", item);
    
        const itemPrice = calculateDiscountedPrice(item);
    
        const isItemInCart = cartItems.find((cartItem) => {
            const sameId = cartItem.product.id === item.id;
            const sameColor = cartItem.product.selectedColor?.code === item.selectedColor?.code;
            const sameSize = cartItem.product.selectedSize === item.selectedSize;
            const noColorOrSize = !item.selectedColor && !item.selectedSize;
    
            return noColorOrSize ? sameId : sameId && sameColor && sameSize;
        });
    
        if (isItemInCart) {
            setCartItems(
                cartItems.map((cartItem) => {
                    const sameId = cartItem.product.id === item.id;
                    const sameColor = cartItem.product.selectedColor?.code === item.selectedColor?.code;
                    const sameSize = cartItem.product.selectedSize === item.selectedSize;
                    const noColorOrSize = !item.selectedColor && !item.selectedSize;
    
                    if (noColorOrSize ? sameId : sameId && sameColor && sameSize) {
                        return { ...cartItem, quantity: cartItem.quantity + 1, product: { ...cartItem.product, price: itemPrice } };
                    }
                    return cartItem;
                })
            );
        } else {
            setCartItems([...cartItems, { product: { ...item, price: itemPrice }, quantity: 1 }]);
        }
    
        setIsCartOpen(true);
        setTimeout(() => {
            setIsCartOpen(false);
        }, 3000); 
    };
    

    const getCartQuantity = () => {
        return cartItems.length;
    };


    const updateCart = (item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot update cart.");
            return;
        }

        const isItemInCart = cartItems.find((cartItem) => {
            const sameId = cartItem.product.id === item.product.id;
            const sameColor = cartItem.product.selectedColor?.code === item.product.selectedColor?.code;
            const sameSize = cartItem.product.selectedSize === item.product.selectedSize;
            const noColorOrSize = !item.product.selectedColor && !item.product.selectedSize;

            return noColorOrSize ? sameId : sameId && sameColor && sameSize;
        });
    
        if (isItemInCart) {
            setCartItems(
                cartItems.map((cartItem) => {
                    const sameId = cartItem.product.id === item.product.id;
                    const sameColor = cartItem.product.selectedColor?.code === item.product.selectedColor?.code;
                    const sameSize = cartItem.product.selectedSize === item.product.selectedSize;
                    const noColorOrSize = !item.product.selectedColor && !item.product.selectedSize;

                    if (noColorOrSize ? sameId : sameId && sameColor && sameSize) {
                        return { ...cartItem, quantity: cartItem.quantity + 1 };
                    }
                    return cartItem;
                })
            );
        } else {
            setCartItems([...cartItems, { product: item, quantity: 1 }]);
        }
    };


    const removeFromCart = (item) => {
        const userId = getUserId();
        if (!userId) {
            console.warn("No user logged in. Cannot remove from cart.");
            return;
        }

        const isItemInCart = cartItems.find((cartItem) => {
            const sameId = cartItem.product.id === item.product.id;
            const sameColor = cartItem.product.selectedColor?.code === item.product.selectedColor?.code;
            const sameSize = cartItem.product.selectedSize === item.product.selectedSize;
            const noColorOrSize = !item.product.selectedColor && !item.product.selectedSize;

            return noColorOrSize ? sameId : sameId && sameColor && sameSize;
        });
    
        if (isItemInCart) {
            if (isItemInCart.quantity === 1) {
                setCartItems(cartItems.filter((cartItem) => {
                    const sameId = cartItem.product.id === item.product.id;
                    const sameColor = cartItem.product.selectedColor?.code === item.product.selectedColor?.code;
                    const sameSize = cartItem.product.selectedSize === item.product.selectedSize;
                    const noColorOrSize = !item.product.selectedColor && !item.product.selectedSize;

                    return !(
                        (noColorOrSize ? sameId : sameId && sameColor && sameSize)
                    );
                }));
            } else {
                setCartItems(
                    cartItems.map((cartItem) => {
                        const sameId = cartItem.product.id === item.product.id;
                        const sameColor = cartItem.product.selectedColor?.code === item.product.selectedColor?.code;
                        const sameSize = cartItem.product.selectedSize === item.product.selectedSize;
                        const noColorOrSize = !item.product.selectedColor && !item.product.selectedSize;

                        if (noColorOrSize ? sameId : sameId && sameColor && sameSize) {
                            return { ...cartItem, quantity: cartItem.quantity - 1 };
                        }
                        return cartItem;
                    })
                );
            }
        }
    };


    const clearCart = () => {
        setCartItems([]);
    };

    const getSubTotal=(item)=>{
        return item.product.price * item.quantity;
      }
    
      const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + getSubTotal(item), 0);
      };


      const handleCartMouseEnter = () => {
          setIsCartOpen(true);
      };
  
      const handleCartMouseLeave = () => {
          setIsCartOpen(false);
      };
  
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