// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: "html",
  use: {
    browserName: "chromium",
    headless: false,
    screenshot: "on",
    trace: "retain-on-failure",
  },
});
