import React from 'react';

const OrderModal = ({ isOpen, onClose, order, products }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative overflow-y-auto" style={{ maxHeight: '80vh' }}>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="overflow-y-auto space-y-2">
                    {order && (
                        <>
                            <h3 className="text-lg font-semibold">Order Number: {order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">Date: {order.orderDate.toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">Time: {order.orderTime}</p>
                            <p className="text-sm text-gray-600">Total: <span className="font-medium">${order.total.toFixed(2)}</span></p>
                            <p className="text-sm text-gray-600">Address: {order.address}</p>
                            <p className="text-sm text-gray-600">Town: {order.town}</p>
                            <p className="text-sm text-gray-600">Zip Code: {order.zipCode}</p>
                            <p className="text-sm text-gray-600">Country: {order.country}</p>
                            <p className="text-sm text-gray-600">Billing Zip: {order.billingZip}</p>
                            <p className="text-sm text-gray-600">Email: {order.userEmail}</p>
                            <p className="text-sm text-gray-600">Phone: {order.userPhone}</p>

                            <div className="mt-4 space-y-4">
                                {order.cartItems.map(item => {
                                    const product = products.find(p => p.id === item.productId);

                                    return product ? (
                                        <div key={item.productId} className="flex items-start border-b pb-4">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover mr-4 rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-lg">{product.name}</p>
                                                {item.selectedColor && (
                                                    <p className="text-sm text-gray-600">
                                                        Color: <span className="font-medium">{item.selectedColor.name}</span>
                                                    </p>
                                                )}
                                                {item.selectedSize && (
                                                    <p className="text-sm text-gray-600">Size: <span className="font-medium">{item.selectedSize}</span></p>
                                                )}
                                                <p className="text-sm text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></p>
                                                <p className="text-sm text-gray-600">Price: <span className="font-medium">${(item.quantity * product.price).toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={item.productId} className="flex items-start border-b pb-4">
                                            <div>
                                                <p className="font-medium text-lg">Product not found</p>
                                                <p className="text-sm text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></p>
                                                <p className="text-sm text-gray-600">Price: <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
