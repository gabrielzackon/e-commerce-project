import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import LogoutActivity from '../models/LogoutActivityModel.js';
import LoginActivity from '../models/LoginActivityModel.js';
import AddToCartActivity from '../models/AddToCartActivityModel.js';

const activityRouter = express.Router();
activityRouter.post(
  '/logoutActivity',
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

activityRouter.post(
  '/loginActivity',
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

activityRouter.post(
  '/addToCartActivity',
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

activityRouter.get(
  '/summary',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const logins = await LoginActivity.find({});
    const logouts = await LogoutActivity.find({});
    const addToCarts = await AddToCartActivity.find({});
    res.send(logins.concat(logouts).concat(addToCarts));
  })
);

export default activityRouter;
