import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'User',
      email: 'user@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Manchester United Home kit 2022/2023',
      slug: 'man-utd-home-kit-22-23',
      category: 'Premier League',
      image: '/images/man-utd-home.png', // 600 X 600 pixels
      price: '120',
      countInStock: 15,
      brand: 'Adidas',
      rating: 3.5,
      numReviews: 10,
      description: 'Manchester United Home kit 2022/2023',
    },
    {
      name: 'Manchester United Away kit 2022/2023',
      slug: 'man-utd-away-kit-22-23',
      category: 'Premier League',
      image: '/images/man-utd-away.png', // 600 X 600 pixels
      price: '120',
      countInStock: 10,
      brand: 'Adidas',
      rating: 2,
      numReviews: 15,
      description: 'Manchester United Away kit 2022/2023',
    },
    {
      name: 'FC Barcelona Home kit 2022/2023',
      slug: 'fc-barcelona-home-kit-22-23',
      category: 'La Liga',
      image: '/images/barcelona-home.png', // 600 X 600 pixels
      price: '110',
      countInStock: 0,
      brand: 'Nike',
      rating: 4,
      numReviews: 10,
      description: 'FC Barcelona Home kit 2022/2023',
    },
    {
      name: 'FC Barcelona Away kit 2022/2023',
      slug: 'fc-barcelona-away-kit-22-23',
      category: 'La Liga',
      image: '/images/barcelona-away.png', // 600 X 600 pixels
      price: '110',
      countInStock: 10,
      brand: 'Nike',
      rating: 4.6,
      numReviews: 23,
      description: 'FC Barcelona Away kit 2022/2023',
    },
  ],
};
export default data;
