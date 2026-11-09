import { defineConfig, devices } from '@playwright/test'
import { BASE, PORT } from './tests/e2e/site'

export default defineConfig({
  testDir: 'tests/e2e',
  globalSetup: './tests/e2e/setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    // --ignore-lock keeps the server in the foreground, where Playwright needs it.
    command: `npm run preview -- --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}${BASE}`,
    reuseExistingServer: !process.env.CI,
  },
})
