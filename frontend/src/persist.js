import Axios from 'axios';

// Startup
// TODO:implement
export const startupAppDataInDB = () => {};

// Login Activity

export const reportLoginActivityToDB = async (name, email, token) => {
  const { data } = await Axios.post(
    '/api/activity/loginActivity',
    {
      name,
      email,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

// Logout Activity
export const reportLogoutActivityToDB = async (name, email, token) => {
  const { data } = await Axios.post(
    '/api/activity/logoutActivity',
    {
      name,
      email,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

// Add To Cart Activity
export const reportAddToCartActivity = async (name, email, product, token) => {
  const { data } = await Axios.post(
    '/api/activity/addToCartActivity',
    {
      name,
      email,
      product,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

// Users activity
export const getUsersActivitySummary = async (token) => {
  const { data } = await Axios.get(
    `/api/activity/summary`,

    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// Login

// TODO:implement
export const userLogin = async (email, password) => {
  const { data } = await Axios.post('/api/users/login', {
    email,
    password,
  });
  return data;
};

// Signup

export const userSignup = async (name, email, password) => {
  const { data } = await Axios.post('/api/users/signup', {
    name,
    email,
    password,
  });
  return data;
};

// Product

export const createProduct = async (
  name,
  slug,
  price,
  image,
  category,
  brand,
  countInStock,
  description,
  token
) => {
  await Axios.post(
    `/api/products/create`,
    {
      name,
      slug,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateProduct = async (
  productId,
  name,
  slug,
  price,
  image,
  category,
  brand,
  countInStock,
  description,
  token
) => {
  await Axios.put(
    `/api/products/update/${productId}`,
    {
      _id: productId,
      name,
      slug,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteProduct = async (productId, token) => {
  await Axios.delete(`/api/products/delete/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProductsForAdminPage = async (page, token) => {
  const { data } = await Axios.get(`/api/products/summary?page=${page} `, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getProducts = async () => {
  return await Axios.get('/api/products');
};

export const getProductsForSearchPage = async (
  page,
  query,
  category,
  price,
  rating,
  order
) => {
  const { data } = await Axios.get(
    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
  );
  return data;
};

export const getProductsCategories = async () => {
  const { data } = await Axios.get(`/api/products/categories`);
  return data;
};

export const getProductsBySlug = async (slug) => {
  return await Axios.get(`/api/products/slug/${slug}`);
};

export const getProductsById = async (productId) => {
  const { data } = await Axios.get(`/api/products/${productId}`);
  return data;
};

// Image Upload

export const uploadProductImage = async (bodyFormData, token) => {
  const { data } = await Axios.post('/api/products/uploadImage', bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Orders

export const postOrder = async (cart, token) => {
  const { data } = await Axios.post(
    '/api/orders',
    {
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentInfo: cart.paymentInfo,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getOrderById = async (orderId, token) => {
  const { data } = await Axios.get(`/api/orders/${orderId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return data;
};

// Cart
export const postCart = async (email, cartItems, token) => {
  const { data } = await Axios.post(
    '/api/carts',
    {
      email: email,
      cartItems: cartItems,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getCartByEmail = async (email, token) => {
  const cartData = await Axios.get(`/api/carts/${email}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return cartData;
};
