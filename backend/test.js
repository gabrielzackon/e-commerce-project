import fetch from 'node-fetch';

test('Test Signup', async () => {
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
    expect(response.status).toBe(200);
  });
});

test('Test Login', async () => {
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
    expect(response.status).toBe(200);
  });
});

// test('Test Startup', async () => {
//   await fetch('http://localhost:5050/api/startup', {
//     method: 'POST',
//     headers: {
//       authorization: `Bearer ${user.token}`,
//     },
//   }).then(async (response) => {
//     const res = await response.json();
//     const status = response.status;
//     expect(res.message).toBe('Set up DB with users and products Successfully');
//     expect(status).toBe(201);
//   });
// });
