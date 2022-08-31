import express, { Router } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './persist.js';

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
app.use('/api', router);

const port = process.env.PORT || 5050;

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
