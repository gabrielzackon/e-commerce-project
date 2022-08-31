import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/SeedRoutes.js';
import productRouter from './routes/ProductRoutes.js';
import userRouter from './routes/UserRoutes.js';
import orderRouter from './routes/OrderRoutes.js';
import cartRouter from './routes/CartRoutes.js';
import LoginActivityRouter from './routes/LoginActivityRoutes.js';

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

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/carts', cartRouter);
app.use('/api/login/activity', LoginActivityRouter);
app.use('/api/seed/startup', seedRouter);

const port = process.env.PORT || 5050;

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
