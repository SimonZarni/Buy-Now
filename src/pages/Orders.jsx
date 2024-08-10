import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import OrderModal from "./OrderModal";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get(`http://localhost:3001/orders?userId=${user.id}`);
        const productsResponse = await axios.get('http://localhost:3001/products');

        const sortedOrders = ordersResponse.data.map(order => ({
          ...order,
          orderDate: new Date(order.orderDate.split('/').reverse().join('-')),
          orderTime: order.orderTime
        })).sort((a, b) => {
          return b.orderDate - a.orderDate || new Date(`1970-01-01T${b.orderTime}`) - new Date(`1970-01-01T${a.orderTime}`);
        });

        setOrders(sortedOrders);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOrders();
  }, [user.id]);

  const handleOrderClick = (orderNumber) => {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order) {
      setSelectedOrder(order);
      setModalOpen(true);
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/products/${productId}`);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-5">
      <div className="breadcrumbs text-sm mx-5">
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li>Order History</li>
        </ul>
      </div>
      <h2 className="text-xl font-bold my-4 uppercase mx-5">Order History</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <div
              key={order.orderNumber}
              className="border-b border-gray-300 mb-4 pb-4 cursor-pointer"
              onClick={() => handleOrderClick(order.orderNumber)}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">Order Number: {order.orderNumber}</h3>
                <button
                  className="bg-black text-white py-2 px-3 rounded uppercase text-sm font-bold border hover:border-black hover:text-black hover:bg-white mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(order.orderNumber);
                  }}
                >
                  Order Details
                </button>
              </div>
              <p className="text-sm text-gray-600">Date: {order.orderDate.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>

              <div className="mt-4">
                {order.cartItems.map(item => {
                  const product = products.find(p => p.id === item.productId);

                  return product ? (
                    <div key={item.productId} className="flex items-start mb-4 justify-between">
                      <div className="flex space-x-3">
                        <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover transition-transform transform hover:scale-105" />
                        <div className="flex flex-col">
                          <p className="font-medium">{product.name}</p>
                          {item.selectedColor && (
                            <p className="text-sm text-gray-600">
                              Color: <span>{item.selectedColor.name}</span>
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                          )}
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="font-medium">${item.quantity * product.price}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          className="border border-black text-black py-2 px-3 rounded uppercase text-sm font-bold hover:bg-black hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(item.productId);
                          }}
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={item.productId} className="flex items-start mb-4">
                      <div>
                        <p className="font-medium">Product not found</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-medium">${item.quantity * item.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={closeModal}
        order={selectedOrder}
        products={products}
      />
    </div>
  );
};

export default Orders;

