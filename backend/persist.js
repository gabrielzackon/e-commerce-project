import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth } from './utils.js';
import expressAsyncHandler from 'express-async-handler';
import LoginActivity from './models/LoginActivityModel.js';
import User from './models/UserModel.js';
import Product from './models/ProductModel.js';
import Order from './models/orderModel.js';
import Cart from './models/CartModel.js ';
import data from './data.js';

const router = express.Router();

// Seed
router.post(
  '/startup',
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const products = await Product.insertMany(data.products);
    await User.deleteMany({});
    const users = await User.insertMany(data.users);
    await LoginActivity.remove({});
    res.status(201).send({
      message: 'Set up DB with users and products Successfully',
      payloda: { products: products, users: users },
    });
  })
);

// Login Activity
router.post(
  '/loginActivity/report',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newLoginReport = new LoginActivity({
      name: req.body.name,
      email: req.body.email,
    });
    const loginReport = await newLoginReport.save();
    res.status(201).send({ message: 'New Login Report Created', loginReport });
  })
);

// Login
router.post(
  '/users/login',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Incorrect email or password' });
  })
);

// Signup
router.post(
  '/users/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// Product
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 3;
router.get(
  '/products/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

router.get(
  '/products/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

router.get(
  '/products/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot Find Product' });
    }
  })
);

router.get(
  '/products/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot Find Product' });
    }
  })
);

// Orders

router.post(
  '/orders',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentInfo: req.body.paymentInfo,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

router.get(
  '/orders/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// Cart
router.post(
  '/carts',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newCartItems = req.body.cartItems.map((x) => ({ ...x }));
    const cart = Cart.findOneAndUpdate(
      { email: req.body.email },
      {
        email: req.body.email,
        cartItems: newCartItems,
      },
      { new: true, upsert: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          res.status(201).send({ message: 'Updated Cart Successfully', data });
        }
      }
    );
  })
);

router.get(
  '/carts/:email',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ email: req.params.email });
    res.send(cart ? cart.cartItems : []);
  })
);
export default router;
