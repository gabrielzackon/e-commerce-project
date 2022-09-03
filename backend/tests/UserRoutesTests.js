import fetch from 'node-fetch';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

const testSignup = async () => {
  try {
    let random_username = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 10);
    const bodySignUp = new User({
      name: random_username,
      email: random_username.concat('@gmail.com'),
      password: bcrypt.hashSync('123456'),
    });
    await fetch('http://localhost:5050/api/users/signup', {
      method: 'POST',
      body: JSON.stringify(bodySignUp),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      return response.status === 200;
    });
  } catch (e) {
    return false;
  }
};

const testLogin = async () => {
  try {
    const bodyLogin = {
      name: 'admin',
      email: 'admin@gmail.com',
      password: '123456',
    };
    await fetch('http://localhost:5050/api/users/login', {
      method: 'POST',
      body: JSON.stringify(bodyLogin),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      return response.status === 200;
    });
  } catch (e) {
    return false;
  }
};

export const userRoutesTest = async () => {
  return [
    { testName: 'Login', result: testLogin() },
    { testName: 'Signup', result: testSignup() },
  ];
};
