import express from 'express';
import data from './data.js';

const app = express();
const port = process.env.PORT || 5050;

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
