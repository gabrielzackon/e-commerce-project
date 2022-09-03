import { userRoutesTest, startupRoutesTest } from './tests/UserRoutesTests.js';
const TEST_KEY = 'Test';
const TESTS_KEY = 'Tests:\n';
const PASSED = 'PASSED';
const FAILED = 'FAILED';
const SEP = '---------------------------------------------------------';
let result;

// UserRoutesTests;
const userRoutesTestResponse = await userRoutesTest();
console.log(`${SEP} \nUserRoutes ${TESTS_KEY}`);
userRoutesTestResponse.map((response) => {
  result = response.result ? PASSED : FAILED;
  console.log(`${TEST_KEY} ${response.testName} - ${result}`);
});

// // StartupRoutesTests
// const startupRoutesTestResponse = await startupRoutesTest();
// console.log(`${SEP} \nStartupRoutes ${TESTS_KEY}`);
// startupRoutesTestResponse.map((response) => {
//   result = response.result ? PASSED : FAILED;
//   console.log(`${TEST_KEY} ${response.testName} - ${result}`);
// });
