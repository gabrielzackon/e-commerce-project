import fetch from 'node-fetch';

async function testStartup() {
  await fetch('http://localhost:5050/api/startup', {
    method: 'POST',
  }).then(async (response) => {
    const res = await response.json();
    const status = response.status;
    console.log(
      res.message === 'Set up DB with users and products Successfully' &&
        status === 201
    );
  });
}
testStartup();
