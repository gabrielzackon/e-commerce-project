import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentInfo: localStorage.getItem('paymentInfo')
      ? JSON.parse(localStorage.getItem('paymentInfo'))
      : {},
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    checkoutItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newCartItem = action.payload;
      const existCartItem = state.cart.cartItems.find(
        (item) => item._id === newCartItem._id
      );
      const cartItems = existCartItem
        ? state.cart.cartItems.map((item) =>
            item._id === existCartItem._id ? newCartItem : item
          )
        : [...state.cart.cartItems, newCartItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentInfo: {},
          checkoutItems: [],
        },
      };
    case 'CHECKOUT_INITIAL':
      return {
        ...state,
        userInfo: localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null,
        cart: {
          shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
          paymentInfo: localStorage.getItem('paymentInfo')
            ? JSON.parse(localStorage.getItem('paymentInfo'))
            : {},
          cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
          checkoutItems: [],
        },
      };
    case 'CHECKOUT_ADD_ITEM':
      const newCheckoutItem = action.payload;
      const existCheckoutItem = state.cart.checkoutItems.find(
        (item) => item._id === newCheckoutItem._id
      );
      const checkoutItems = existCheckoutItem
        ? state.cart.checkoutItems.map((item) =>
            item._id === existCheckoutItem._id ? newCheckoutItem : item
          )
        : [...state.cart.checkoutItems, newCheckoutItem];
      localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
      return { ...state, cart: { ...state.cart, checkoutItems } };
    case 'CHECKOUT_REMOVE_ITEM': {
      const checkoutItems = state.cart.checkoutItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
      return { ...state, cart: { ...state.cart, checkoutItems } };
    }
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_INFO':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentInfo: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
