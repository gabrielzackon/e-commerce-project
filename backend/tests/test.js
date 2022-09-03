import { userRoutesTest } from './UserRoutesTests';
const USER_ROUTES_TEST = 'UserRoutes Tests:/n';
const TEST_KEY = 'Test';
const PASSED = 'PASSED';
const FAILED = 'FAILED';
let result;

// UserRoutesTests
userRoutesTestResponse = await userRoutesTest();
userRoutesTestResponse.map((response) => {
  result = response.result ? PASSED : FAILED;
  console.log(`${TEST_KEY} ${response.testName} - ?${result}`);
});
