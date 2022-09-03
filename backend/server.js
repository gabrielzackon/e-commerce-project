import express, { Router } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderRouter from './routes/OrderRoutes.js';
import activityRouter from './routes/ActivityRoutes.js';
import productsRouter from './routes/ProductsRoutes.js';
import cartRouter from './routes/CartRoutes.js';
import userRouter from './routes/UsersRoutes.js';
import startupRouter from './routes/StartupRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to DB');
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/orders', orderRouter);
app.use('/api/activity', activityRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/startup', startupRouter);

const port = process.env.PORT || 5050;

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
