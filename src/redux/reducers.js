import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  APPLY_COUPON,
  CLEAR_COUPON,
} from "./actions";

const PRODUCTS = [
  { id: 1, title: "Laptop", price: 800 },
  { id: 2, title: "Headphones", price: 120 },
  { id: 3, title: "Keyboard", price: 70 },
  { id: 4, title: "Mouse", price: 40 },
  { id: 5, title: "Monitor", price: 250 },
  { id: 6, title: "Webcam", price: 95 },
];

const COUPONS = {
  SAVE10: 10, // 10% off
  SAVE20: 20, // 20% off
  SAVE30: 30, // 30% off
};

const initialState = {
  products: PRODUCTS,
  cart: [],
  wishlist: [],
  appliedCoupon: "",
  discountPercent: 0,
  couponError: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const product = action.payload; // the product object being added to the cart
      const existing = state.cart.find((item) => item.id === product.id); // check if the product is already in the cart

      const nextCart = existing
        ? state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.cart, { ...product, quantity: 1 }]; // if it exists, increase quantity, otherwise add new item with quantity 1

      return {
        ...state,
        cart: nextCart,
        wishlist: state.wishlist.filter((item) => item.id !== product.id), // remove from wishlist if it's being added to cart
      };
    }

    case REMOVE_FROM_CART: 
    return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload), // remove the product from the cart
        // Why we written action.payload instead of product.id because in action creator we are passing productId as payload
    }

    case INCREASE_QUANTITY:
        return {
            ...state,
            cart: state.cart.map((item) => item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item)
        }

    case DECREASE_QUANTITY:
        return {
            ...state,
            cart: state.cart.map((item) => item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0) // Remove item if quantity drops to 0
        };

    case ADD_TO_WISHLIST: {
        const exists = state.wishlist.some((item) => item.id === action.payload.id); // Check if the product is already in the wishlist
        if (exists) return state; // If it already exists, do nothing

        return {
            ...state,
            wishlist: [...state.wishlist, action.payload],
        };
    }

    case REMOVE_FROM_WISHLIST:
        return {
            ...state,
            wishlist: state.wishlist.filter((item) => item.id !== action.payload), // Remove the product from the wishlist
        };

    case APPLY_COUPON: {
        const code = action.payload.trim().toUpperCase(); // Normalize the coupon code
        const discount = COUPONS[code]; // Look up the discount percentage for the given coupon code

        if (!discount) {
            return {
                ...state,
                appliedCoupon: "",
                discountPercent: 0,
                couponError: "Invalid coupon",
            };
        }

        return {
            ...state,
            appliedCoupon: code,
            discountPercent: discount,
            couponError: "",
        }
    }

    case CLEAR_COUPON:
        return {
            ...state,
            appliedCoupon: "",
            discountPercent: 0,
            couponError: "",
        };

    default:
        return state;
  }
};

export default rootReducer;