import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import Cart from '../models/CartModel.js ';
import LogoutActivity from '../models/LogoutActivityModel.js ';
import LoginActivity from '../models/LoginActivityModel.js ';
import AddToCartActivity from '../models/AddToCartActivityModel.js ';
import data from '../data.js';

const startupRouter = express.Router();

startupRouter.post(
  '',
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await LoginActivity.deleteMany({});
    await Order.deleteMany({});
    await LogoutActivity.deleteMany({});
    await AddToCartActivity.deleteMany({});
    await Cart.deleteMany({});
    const products = await Product.insertMany(data.products);
    const users = await User.insertMany(data.users);
    res.status(201).send({
      message: 'Set up DB with users and products Successfully',
      payload: { products: products, users: users },
    });
  })
);

export default startupRouter;
