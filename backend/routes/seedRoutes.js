import express from 'express';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import data from '../data.js';
import LoginActivity from '../models/LoginActivityModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  const products = await Product.insertMany(data.products);
  const users = await User.insertMany(data.users);
  res.send({ products, users });
});

seedRouter.post('/startup', async (req, res) => {
  await Product.deleteMany({});
  const products = await Product.insertMany(data.products);
  await User.deleteMany({});
  const users = await User.insertMany(data.users);
  await LoginActivity.remove({});
  res.status(201).send({
    message: 'Set up DB with users and products Successfully',
    payloda: { products: products, users: users },
  });
});

export default seedRouter;
