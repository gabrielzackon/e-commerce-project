import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Cart from '../models/CartModel.js';
import User from '../models/UserModel.js';
import { isAuth } from '../utils.js';

const cartRouter = express.Router();
cartRouter.post(
  '/',
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

cartRouter.get(
  '/:email',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ email: req.params.email });
    res.send(cart ? cart.cartItems : []);
  })
);

export default cartRouter;
