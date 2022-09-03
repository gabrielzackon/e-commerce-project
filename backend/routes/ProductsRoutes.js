import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';
import { isAuth, isAdmin } from '../utils.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer();
const DUPLICATE_NAME_MESSAGE = 'Product with the same "Name" already exists';
const DUPLICATE_SLUG_MESSAGE = 'Product with the same "Slug" already exists';
const DUPLICATE_NAME_AND_SLUG_MESSAGE =
  'Product with the same "Name" and "Slug" already exists';

const productsRouter = express.Router();
productsRouter.post(
  '/create',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const existProductWithSameSlug = await Product.find({
      slug: req.body.slug,
    });
    const existProductWithSameName = await Product.find({
      name: req.body.name,
    });
    if (
      existProductWithSameSlug.length == 0 &&
      existProductWithSameName.length == 0
    ) {
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
    } else {
      res.status(409).send({
        message:
          existProductWithSameSlug.length > 0 &&
          existProductWithSameName.length > 0
            ? DUPLICATE_NAME_AND_SLUG_MESSAGE
            : existProductWithSameSlug.length > 0
            ? DUPLICATE_SLUG_MESSAGE
            : DUPLICATE_NAME_MESSAGE,
      });
    }
  })
);

productsRouter.put(
  '/update/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let existProductWithSameSlug = await Product.find({
      slug: req.body.slug,
    });
    existProductWithSameSlug = existProductWithSameSlug.filter(
      (p) => p._id != req.params.id
    );
    let existProductWithSameName = await Product.find({
      name: req.body.name,
    });
    existProductWithSameName = existProductWithSameName.filter(
      (p) => p._id != req.params.id
    );
    if (
      existProductWithSameSlug.length == 0 &&
      existProductWithSameName.length == 0
    ) {
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
    } else {
      res.status(409).send({
        message:
          existProductWithSameSlug.length > 0 &&
          existProductWithSameName.length > 0
            ? DUPLICATE_NAME_AND_SLUG_MESSAGE
            : existProductWithSameSlug.length > 0
            ? DUPLICATE_SLUG_MESSAGE
            : DUPLICATE_NAME_MESSAGE,
      });
    }
  })
);

productsRouter.delete(
  '/delete/:id',
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

productsRouter.get(
  '/summary',
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

productsRouter.get('', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 9;
productsRouter.get(
  '/search',
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

productsRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productsRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot Find Product' });
    }
  })
);

productsRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot Find Product' });
    }
  })
);

productsRouter.post(
  '/uploadImage',
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

export default productsRouter;
