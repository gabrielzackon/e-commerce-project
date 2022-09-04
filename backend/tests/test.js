import fetch from 'node-fetch';
import User from '../models/UserModel.js';
import Product from '../models/ProductModel.js';
import bcrypt from 'bcryptjs';

async function testProductsCreate() {
  const testProduct = new Product({
    name: test,
    slug: test,
    image: test,
    price: 0,
    category: test,
    brand: test,
    countInStock: test,
    rating: 0,
    numReviews: 0,
    description: test,
  });
  await fetch('http://localhost:5050/api/products/create', {
    method: 'POST',
    body: JSON.stringify(testProduct),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    console.log(response);
    const res = await response.json();
    console.log(res);
    //console.log(res.message === 'Product Created');
  });
}
testProductsCreate();
