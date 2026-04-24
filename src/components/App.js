import React from "react";
import "./../styles/App.css";
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  addToWishlist,
  removeFromWishlist,
  applyCoupon,
  clearCoupon,
} from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const dispatch = useDispatch();
  const {
    products,
    cart,
    wishlist,
    appliedCoupon,
    discountPercent,
    couponError,
  } = useSelector((state) => state); // Accessing the entire state object from the Redux store

  const [couponInput, setCouponInput] = useState("");

  const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const discountAmount = useMemo(
    () => Number(((subTotal * discountPercent) / 100).toFixed(2)),
    [subTotal, discountPercent],
  );

  const total = useMemo(
    () => subTotal - discountAmount,
    [subTotal, discountAmount],
  );

  const wishListIds = useMemo(
    () => new Set(wishlist.map((item) => item.id)),
    [wishlist],
  );

  const handleApplyCoupon = () => {
    dispatch(applyCoupon(couponInput));
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Shopping Cart</h1>

      <h2>Products</h2>

      <div>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => dispatch(addToCart(product))}>
              Add to Cart
            </button>
            <button
              onClick={() =>
                wishListIds.has(product.id)
                  ? dispatch(removeFromWishlist(product.id))
                  : dispatch(addToWishlist(product))
              }
              style={{ marginLeft: "8px" }}
            >
              {wishListIds.has(product.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
        ))}
      </div>

      <h2>Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Wishlist is empty</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item.id} style={{ marginBottom: "8px" }}>
              {item.title} - {item.price}
              <button
                onClick={() => dispatch(addToCart(item))}
                style={{ marginLeft: "8px" }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => dispatch(removeFromWishlist(item.id))}
                style={{ marginLeft: "8px" }}
              >
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => dispatch(decreaseQuantity(item.id))}>
                    -
                  </button>
                  <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQuantity(item.id))}>
                    +
                  </button>
                </td>
                <td>{Number((item.price * item.quantity).toFixed(2))}</td>
                <td>
                  <button onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      <h2>Coupon</h2>
      <input 
      type="text"
      value={couponInput}
      onChange={(e) => setCouponInput(e.target.value)}
      placeholder="Enter coupon"
      />

      <button onClick={handleApplyCoupon} style={{ marginLeft: "8px" }}>
        Apply Coupon
      </button>

      {appliedCoupon ? (
        <button onClick={() => dispatch(clearCoupon())} style={{ marginLeft: "8px" }}>
          Clear Coupon
        </button>
      ): null}
      {couponError ? <p style={{ color: "red" }}>{couponError}</p> : null}

      <h2>Summary</h2>
      <p>Subtotal: ${subTotal.toFixed(2)}</p>
      <p>Discount: ${discountAmount.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default App;
