import fetch from 'node-fetch';
import User from './models/UserModel.js';
import bcrypt from 'bcryptjs';

// async function testStartup() {
//   await fetch('http://localhost:5050/api/startup', {
//     method: 'POST',
//   }).then(async (response) => {
//     const res = await response.json();
//     const status = response.status;
//     console.log(
//       res.message === 'Set up DB with users and products Successfully' &&
//         status === 201
//     );
//   });
// }
// testStartup();

// async function testSignup() {
//   let random_username = Math.random()
//     .toString(36)
//     .replace(/[^a-z]+/g, '')
//     .substr(0, 10);
//   const bodySignUp = new User({
//     name: random_username,
//     email: random_username + '@gmail.com',
//     password: bcrypt.hashSync('123456'),
//   });
//   await fetch('http://localhost:5050/api/users/signup', {
//     method: 'POST',
//     body: JSON.stringify(bodySignUp),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   }).then(async (response) => {
//     console.log(response.status === 200);
//   });
// }
// testSignup();

async function testLogin() {
  const bodySignUp = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: '123456',
  };
  await fetch('http://localhost:5050/api/users/login', {
    method: 'POST',
    body: JSON.stringify(bodySignUp),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    console.log(response.status === 200);
  });
}
testLogin();

// async function testProductsCreate() {
//   await fetch('http://localhost:5050/api/products/create', {
//     method: 'POST',
//   }).then(async (response) => {
//     console.log(response);
//     const res = await response.json();
//     console.log(res);
//     //console.log(res.message === 'Product Created');
//   });
// }
// testProductsCreate();
