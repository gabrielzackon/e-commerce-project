import express from 'express';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const products = await Product.insertMany(data.products);
  await User.remove({});
  const users = await User.insertMany(data.users);
  res.send({ products, users });
});

export default seedRouter;
