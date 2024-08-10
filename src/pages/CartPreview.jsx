import React, { useContext } from 'react';
import CartContext from '../CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPreview = () => {
    const [isVisible, setIsVisible] = useState(true);
    const { cartItems } = useContext(CartContext);

    const handleClose = () => {
        setIsVisible(false);
    };
    if (!isVisible) return null;


    return (
        <>
            <div
                className="fixed inset-0 opacity-90 z-40" style={{backgroundColor:'rgb(0,0,0,0.4)'}}
                onClick={handleClose}
            ></div>
            <div className="absolute right-0 mt-2 w-96 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 h-96 flex flex-col">
                <div className="flex justify-between">
                    <h2 className='text-xl font-semibold p-4'>Cart Preview</h2>
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-700">Your cart is empty</p>
                    ) : (
                        <ul className="space-y-5">
                            {cartItems.slice().reverse().map((item, index) => (
                                <li key={index} className="flex flex-col space-x-4 shadow my-6 py-3 px-2">
                                    <div className="grid grid-cols-4">
                                        <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl" />
                                        <div className="col-span-2 flex flex-col">
                                            <h3 className="text-gray-700 font-semibold truncate">{item.product.name}</h3>
                                            {item.product.selectedColor && (
                                                <p className="text-gray-500">Color: {item.product.selectedColor.name}</p>
                                            )}
                                            {item.product.selectedSize && (
                                                <p className="text-gray-500">Size: {item.product.selectedSize}</p>
                                            )}
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-gray-500 mx-3">${item.product.price}</p>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="p-5">
                    <Link to="/cart" onClick={handleClose} className="text-center block w-full bg-black text-white py-2 rounded-md">
                        View Cart
                    </Link>
                </div>
            </div>
        </>
    );
};

export default CartPreview;
