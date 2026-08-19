// Playwright E2E cho Potofilo. Chạy: npm i && npx playwright install chromium && npx playwright test
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: false,
  use: { baseURL: 'http://localhost:4001', headless: true, viewport: { width: 1440, height: 900 } },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Tự phục vụ app/ nếu chưa có server (dùng lại server đang chạy nếu có)
  webServer: {
    command: 'python -m http.server 4001 --directory app',
    url: 'http://localhost:4001/',
    reuseExistingServer: true,
    timeout: 15000
  }
});
