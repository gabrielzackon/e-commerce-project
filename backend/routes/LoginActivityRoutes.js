import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth } from '../utils.js';
import expressAsycnhandler from 'express-async-handler';
import LoginActivity from '../models/LoginActivityModel.js';

const LoginActivityRouter = express.Router();

LoginActivityRouter.post(
  '/report',
  isAuth,
  expressAsycnhandler(async (req, res) => {
    const newLoginReport = new LoginActivity({
      name: req.body.name,
      email: req.body.email,
    });
    const loginReport = await newLoginReport.save();
    res.status(201).send({ message: 'New Login Report Created', loginReport });
  })
);

export default LoginActivityRouter;
