const { test, expect, request } = require("@playwright/test");
const { APiUtils } = require("./Utils/APiUtils");
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
let response;
test.beforeEach(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

// Create order is success
test("Place the order", async ({ page }) => {
  // const apiUtils = new APiUtils(apiContext, loginPayload);
  // const orderId = await apiUtils.createOrder(orderPayload);
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://www.rahulshettyacademy.com/client/");
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button.btn-primary").click();
      break;
    }
  }
  const orderDetails = await page.locator(".col-text").textContent();
  await page.pause();
  expect(response.orderId.includes(orderDetails)).toBeTruthy();
});
