const { test, expect, request } = require("@playwright/test");
const console = require("node:console");
const loginPayload = {
  userEmail: "lethinhphat7102003@gmail.com",
  userPassword: "Phat12345",
};
const orderPayload = {
  orders: [
    { country: "VietNam", productOrderedId: "6960eac0c941646b7a8b3e68" },
  ],
};
let token;
let orderId;
test.beforeEach(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://www.rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload,
    },
  );
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  token = loginResponseJson.token;
  console.log("Token:", token);

  const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",

    {
      data: orderPayload,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    },
  );
  console.log("Order response status:", orderResponse.status());
  expect(orderResponse.ok()).toBeTruthy();
  const orderResponseJson = await orderResponse.json();
  console.log(orderResponseJson);
  orderId = orderResponseJson.orders[0];
});
test.beforeAll(async () => {});

test("Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);
  await page.goto("https://www.rahulshettyacademy.com/client/");
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button.btn-primary").click();
      break;
    }
  }
  const orderDetails = await page.locator(".col-text").textContent();
  await page.pause();
  expect(orderId.includes(orderDetails)).toBeTruthy();
});
