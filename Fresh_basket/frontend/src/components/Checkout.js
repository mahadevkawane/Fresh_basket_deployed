import React, { useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  // Fetch cart items from deployed backend
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://fresh-basket-backend.onrender.com/api/cart"
      );
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Clear the cart after successful order
  const clearCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item) =>
          axios.delete(
            `https://fresh-basket-backend.onrender.com/api/cart/${item._id}`
          )
        )
      );
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://fresh-basket-backend.onrender.com/api/checkout",
        {
          Name: formData.name,     // match backend keys
          Address: formData.address,
          Phone: formData.phone,
        }
      );

      setMessage("✅ Order placed successfully!");
      setFormData({ name: "", address: "", phone: "" });
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage("❌ Failed to place order. Try again.");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={`https://fresh-basket-backend.onrender.com/Images/${item.image}`}
                    alt={item.productName}
                    className="h-20 w-20 object-contain rounded mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} × ₹{item.price} = ₹
                      {item.quantity * item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 text-right font-bold text-xl">
              Total: <span className="text-green-600">₹{totalPrice}</span>
            </div>
          </div>

          {/* Billing Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Billing Details</h2>
            {message && <p className="text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
