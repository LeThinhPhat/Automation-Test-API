const { test, expect, request } = require("@playwright/test");
const console = require("node:console");
const loginPayload = {
  userEmail: "lethinhphat7102003@gmail.com",
  userPassword: "Phat123456",
};
const orderPayload = {
  orders: [
    { country: "VietNam", productOrderedId: "62023a7616fcf72fe9dfc619" },
  ],
};
let token;
const orderId;
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
  console.log("Token:", token);

  const orderResponse = apiContext.post(
    "https://www.rahulshettyacademy.com/api/ecom/orders/create-order",

    {
      data: orderPayload,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    },
  );
  const orderResponseJson = await orderResponse.json();
  console.log(orderResponseJson);
  orderId = orderResponseJson.orders[0];
});
test.beforeAll(async () => {});
