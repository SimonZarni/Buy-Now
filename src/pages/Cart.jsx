import { useContext } from "react";
import CartContext from "../CartContext";
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateCart, removeFromCart, clearCart, getSubTotal, getCartTotal } = useContext(CartContext);
  const { getCartQuantity } = useContext(CartContext);

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
  };

  return (
    <>
      <div className="breadcrumbs text-sm mx-10 mt-4">
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li>Carts</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-between h-full">
        <div className="w-full md:w-2/3 bg-white p-4">
          <div className="flex justify-between items-center border-b p-4 px-5">
            <div className="flex flex-col space-y-3">
              <h2 className="text-2xl font-bold uppercase">Your Shopping Bag</h2>
              <p><span className="font-semibold">{getCartQuantity()} items</span> in your bag</p>
            </div>
            <div className="tooltip tooltip-left" data-tip="Clear All Items">
              <button className="btn btn-circle" onClick={() => {
                if (window.confirm('Are you sure to clear all items in the cart?')) {
                  clearCart();
                }
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 h-full">
            {cartItems.length === 0 ? (
              <div className="flex flex-grow justify-center items-center">
                <div className="text-center">
                  <img src="images/no_bag.jpg" className="mx-auto mb-4 w-1/2 h-1/2" alt="No items in cart" />
                  <p className="text-gray-500">Your bag is empty</p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="flex items-center p-5" key={item.product.id}>
                  <div className="flex justify-around gap-4 border-b border-black pb-10 w-full">
                    <div className="w-1/3">
                      <img src={item.product.image_url} alt={item.product.name} className="rounded-md w-full h-56 object-cover" />
                    </div>
                    <div className="flex flex-col space-y-8 w-2/3">
                      <h1 className="text-2xl font-bold uppercase">{item.product.name}</h1>
                      <div className="flex space-x-8">
                        {item.product.selectedSize && (
                          <p className="text-black font-bold text-sm uppercase">Size - {item.product.selectedSize}</p>
                        )}
                        {item.product.selectedColor && item.product.selectedSize && (
                          <span
                            className="border border-gray-500 h-6 me-4"
                          ></span>
                        )}
                        {item.product.selectedColor && (
                          <div className="flex items-center">
                            <span
                              className="rounded-full border border-gray-500 w-6 h-6"
                              style={{ backgroundColor: item.product.selectedColor?.code || 'transparent' }}
                            ></span>
                            <p className="text-black font-bold text-sm uppercase mx-3">{item.product.selectedColor?.name}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-black text-lg mt-3 font-bold">${getSubTotal(item).toFixed(2)}</p>
                        <div className="flex space-x-2">
                          <button
                            className='font-bold uppercase rounded-full btn btn-ghost'
                            onClick={() => handleRemoveFromCart(item)}
                          >
                            {item.quantity === 1 ? <FaTrash /> : <FaMinus />}
                          </button>
                          <p className="flex items-center justify-center w-5 h-10 mt-1 font-bold text-sm">{item.quantity}</p>
                          <button
                            className="font-bold uppercase rounded-full btn btn-ghost"
                            onClick={() => updateCart(item)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white rounded-lg p-4 mt-8 md:mt-0 md:ml-4 h-full">
          {cartItems.length > 0 && (
            <>
              <h2 className="text-xl font-bold my-4 uppercase">Order Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left uppercase">Product</th>
                      <th className="px-4 py-2 text-left uppercase">Quantity</th>
                      <th className="px-4 py-2 text-right uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product.id} className="border-t">
                        <td className="px-4 py-2">
                          {item.product.name}
                          {item.product.selectedColor && (
                            <p className="text-black text-sm uppercase truncate">({item.product.selectedColor?.name})</p>
                          )}
                          {item.product.selectedSize && (
                            <p className="text-black text-sm uppercase">({item.product.selectedSize})</p>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <p className="text-black text-sm">{item.quantity}</p>
                        </td>
                        <td className="px-4 py-2 text-right">${(item.product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-lg font-bold uppercase">Total:</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 text-right text-lg font-bold">${getCartTotal().toFixed(2)}</td>
                    </tr>
                  </tfoot>

                </table>
                <div className="px-3 w-full">
                  <Link
                    to="/checkout" state={{ cartItems }}
                    className="mt-4 p-3 bg-black text-white text-sm font-bold uppercase rounded hover:border border-black hover:bg-white hover:text-black text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
