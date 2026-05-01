const { test, expect, request } = require("@playwright/test");
const loginPayload = {
  userEmail: "lethinhphat7102003@gmail.com",
  userPassword: "Phat123456",
};

test.beforeEach(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://www.rahulshettyacademy.com/client/auth/login",
    {
      data: loginPayload,
    },
  );
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.token;
});
test.beforeAll(async () => {});
