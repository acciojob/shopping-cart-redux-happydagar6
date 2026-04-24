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
    <div className="container py-3" style={{ maxWidth: "980px", fontFamily: "sans-serif" }}>
      <nav className="navbar navbar-expand-lg mb-3">
        <div className="text-center w-100">
          <h1 className="m-0">Shopping Cart</h1>
        </div>
      </nav>

      <h2>Products</h2>
      <div className="row product-list">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="custom-card card h-100">
              <div className="card-body">
                <h4 className="card-title">{product.title}</h4>
                <p className="card-text">Price: ${product.price}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(addToCart(product))}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-outline-secondary ms-2"
                  onClick={() =>
                    wishListIds.has(product.id)
                      ? dispatch(removeFromWishlist(product.id))
                      : dispatch(addToWishlist(product))
                  }
                >
                  {wishListIds.has(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Cart Items ({cart.length})</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="row cart-list">
          {cart.map((item) => (
            <div className="col-md-6 mb-3" key={item.id}>
              <div className="cart-card card">
                <div className="card-body">
                  <h4 className="card-title">{item.title}</h4>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ${Number((item.price * item.quantity).toFixed(2))}</p>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    Increase Quantity
                  </button>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    Decrease Quantity
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove from Cart
                  </button>
                  <button
                    className="move-to-wishlist ms-2"
                    onClick={() => dispatch(addToWishlist(item))}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <p>Wishlist is empty</p>
      ) : (
        <div className="row wishlist-list">
          {wishlist.map((item) => (
            <div className="col-md-6 mb-3" key={item.id}>
              <div className="wishlist-card card">
                <div className="card-body">
                  <h4 className="card-title">{item.title}</h4>
                  <p>Price: ${item.price}</p>
                  <button
                    className="btn-primary me-2"
                    onClick={() => dispatch(addToCart(item))}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Coupon</h2>
      <input
        className="form-control"
        type="text"
        value={couponInput}
        onChange={(e) => setCouponInput(e.target.value)}
        placeholder="Enter coupon"
      />

      <button className="btn btn-dark mt-2" onClick={handleApplyCoupon}>
        Apply Coupon
      </button>

      {appliedCoupon ? (
        <button
          className="btn btn-outline-dark mt-2 ms-2"
          onClick={() => dispatch(clearCoupon())}
        >
          Clear Coupon
        </button>
      ) : null}
      {couponError ? <p style={{ color: "red" }}>{couponError}</p> : null}

      <h2>Summary</h2>
      <p>Subtotal: ${subTotal.toFixed(2)}</p>
      <p>Discount: ${discountAmount.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default App;
