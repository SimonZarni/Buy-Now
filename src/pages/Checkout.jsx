import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import CartContext from "../CartContext";
import axios from "axios";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    country: "",
    town: "",
    zipCode: "",
    creditCardNumber: "",
    billingZip: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const { clearCart } = useContext(CartContext);

  const [orderNumber, setOrderNumber] = useState(
    () => `ORD-${Math.floor(Math.random() * 1000000)}`
  );
  const [orderDate] = useState(() => {
    return new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Yangon" });
  });

  const [orderTime] = useState(() => {
    return new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Yangon" });
  });

  const [status] = useState("pending"); // Default status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You need to be logged in to place an order.");
      return;
    }

    const order = {
      orderNumber,
      orderDate,
      orderTime,
      status, // Add status here
      userId: user.id,
      userEmail: formData.email,
      userPhone: formData.phone,
      address: formData.address,
      town: formData.town,
      zipCode: formData.zipCode,
      country: formData.country,
      billingZip: formData.billingZip,
      creditCardNumber: formData.creditCardNumber,
      expMonth: formData.expMonth,
      expYear: formData.expYear,
      cvc: formData.cvc,
      cartItems: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.price,
        selectedColor: item.product.selectedColor,
        selectedSize: item.product.selectedSize,
      })),
      total: cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      ),
    };

    try {
      // await axios.post("http://localhost:3001/orders", order);
      await axios.post("https://buy-now-jocc.onrender.com/orders", order);

      clearCart();
      navigate("/products");
      alert("Order Successfully");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-5">
      <div className="breadcrumbs text-sm mx-8 mt-4">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/cart"}>Carts</Link>
          </li>
          <li>Checkout</li>
        </ul>
      </div>
      <h2 className="text-xl font-bold my-4 uppercase mx-8">Checkout</h2>
      <div className="flex justify-around">
        <div className="w-3/5">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white shadow-lg rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="town"
              placeholder="Town"
              value={formData.town}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            />
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Myanmar">Myanmar</option>
            </select>

            <input
              type="text"
              name="creditCardNumber"
              placeholder="Credit Card Number"
              value={formData.creditCardNumber}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            />
            <div className="grid grid-cols-3 gap-6">
              <input
                type="text"
                name="expMonth"
                placeholder="MM"
                value={formData.expMonth}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                name="expYear"
                placeholder="YYYY"
                value={formData.expYear}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                name="cvc"
                placeholder="CVC"
                value={formData.cvc}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
            </div>
            <input
              type="text"
              name="billingZip"
              placeholder="Billing Zip Code"
              value={formData.billingZip}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded w-full"
            />
            <Button
              type="submit"
              value="Place Order"
              paddingX={"px-6"}
              paddingY={"py-3"}
              width={"w-full"}
            ></Button>
          </form>
        </div>
        <div className="text-black border border-collapse shadow-lg rounded-lg p-6 mb-6 w-1/3">
          <h2 className="text-xl font-bold my-4 uppercase">Invoice</h2>
          <div className="mb-4">
            <p className="font-medium">Order Number: {orderNumber}</p>
            <p className="text-sm text-gray-600">Date: {orderDate}</p>
            <p className="text-sm text-gray-600">Time: {orderTime}</p>
          </div>
          {cartItems.map((item) => {
            const { id, name, price, selectedColor, selectedSize } =
              item.product;
            const colorKey = selectedColor ? `-${selectedColor.code}` : "";
            const sizeKey = selectedSize ? `-${selectedSize}` : "";

            return (
              <div
                key={`${id}${colorKey}${sizeKey}`}
                className="flex justify-between items-center mb-4 border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {name} {selectedColor && `(${selectedColor.name}`}{" "}
                    {selectedSize && `, ${selectedSize}`})
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${item.quantity * price}</p>
              </div>
            );
          })}

          <div className="flex justify-between font-bold mt-4">
            <p>Total:</p>
            <p>
              $
              {cartItems
                .reduce(
                  (acc, item) => acc + item.quantity * item.product.price,
                  0
                )
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
