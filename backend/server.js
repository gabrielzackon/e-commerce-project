import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Cannot Find Product' });
  }
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
