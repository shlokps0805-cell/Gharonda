import { defineConfig } from '@playwright/test';

// npm run test : starts the dev server and runs the checks in Chromium
export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://localhost:5199', viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npx vite --port 5199 --strictPort', url: 'http://localhost:5199', reuseExistingServer: true, timeout: 60000 },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
