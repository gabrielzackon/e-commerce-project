import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth, isAdmin } from './utils.js';
import expressAsyncHandler from 'express-async-handler';
import LoginActivity from './models/LoginActivityModel.js';
import LogoutActivity from './models/LogoutActivityModel.js';
import AddToCartActivity from './models/AddToCartActivityModel.js';
import User from './models/UserModel.js';
import Product from './models/ProductModel.js';
import Order from './models/OrderModel.js';
import Cart from './models/CartModel.js ';
import data from './data.js';

const router = express.Router();
const upload = multer();

// Startup
router.post(
  '/startup',
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

// Logout Activity
router.post(
  '/logoutActivity/report',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newLogoutReport = new LogoutActivity({
      name: req.body.name,
      email: req.body.email,
    });
    const logoutReport = await newLogoutReport.save();
    res
      .status(201)
      .send({ message: 'New Logout Report Created', logoutReport });
  })
);

// Add To Cart Activity
router.post(
  '/addToCartActivity/report',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newATCReport = new AddToCartActivity({
      email: req.body.email,
      slug: req.body.product.slug,
      name: req.body.name,
      image: req.body.product.image,
      price: req.body.product.price,
      product: req.body.product._id,
    });
    const addToCartReport = await newATCReport.save();
    res
      .status(201)
      .send({ message: 'New ATC Report Created', addToCartReport });
  })
);

// Users activity
router.get(
  '/activity/summary',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const logins = await LoginActivity.find({});
    const logouts = await LogoutActivity.find({});
    const addToCarts = await AddToCartActivity.find({});
    res.send(logins.concat(logouts).concat(addToCarts));
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

router.post(
  '/products',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      rating: 0,
      numReviews: 0,
      description: req.body.description,
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

router.put(
  '/products/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.delete(
  '/products/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.get(
  '/products/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 9;
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

// Image Upload

router.post(
  '/upload',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
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

router.get(
  '/orders/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
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
