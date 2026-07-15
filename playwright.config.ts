import { defineConfig, devices } from "@playwright/test";

const LOCAL_BASE_URL = "http://127.0.0.1:5173";
const providedBaseUrl = process.env.BASE_URL;
const baseURL = providedBaseUrl || LOCAL_BASE_URL;
const shouldStartLocalServer = !providedBaseUrl;

export default defineConfig({
  testDir: "./tests/specs",
  fullyParallel: true,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    acceptDownloads: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: shouldStartLocalServer
    ? {
        command: "npm run dev -- --host 127.0.0.1 --port 5173",
        url: LOCAL_BASE_URL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
