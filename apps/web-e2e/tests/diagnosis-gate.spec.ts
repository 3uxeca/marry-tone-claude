/**
 * Diagnosis Gate E2E smoke tests.
 *
 * These tests require BOTH services to be running:
 *   - Next.js web app  → http://localhost:3000  (BASE_URL)
 *   - API server       → http://localhost:4000  (API_URL)
 *
 * Start them with:
 *   docker compose up   OR   pnpm dev (from repo root)
 *
 * Tests are skipped automatically when the web app is unreachable so that
 * CI pipelines that don't spin up the full stack won't fail.
 */

import { test, expect, type Page, type APIRequestContext } from '@playwright/test'

const API_BASE = process.env.API_URL ?? 'http://localhost:4000'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function isBaseUrlReachable(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(page.context().browser()?.version() ? '/' : '/', {
      timeout: 3000,
    })
    return res.status() < 500
  } catch {
    return false
  }
}

async function seedSession(request: APIRequestContext): Promise<string> {
  const email = `test-${Date.now()}@example.com`

  await request.post(`${API_BASE}/api/auth/register`, {
    data: { email, password: 'TestPass123!', name: 'Test User' },
  })

  await request.post(`${API_BASE}/api/auth/login`, {
    data: { email, password: 'TestPass123!' },
  })
  // The Playwright API context automatically stores the session cookie, which
  // is shared with `page` within the same browser context.

  return email
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Diagnosis Gate', () => {
  test.beforeEach(async ({ page, request }) => {
    // Skip the entire suite when the web app is not running.
    const reachable = await page.request
      .get('/', { timeout: 3000 })
      .then(() => true)
      .catch(() => false)

    if (!reachable) {
      test.skip(true, 'Web app is not running — start with `docker compose up` or `pnpm dev`')
    }

    // Seed an authenticated session via the API.
    await seedSession(request)

    await page.goto('/diagnosis-gate')
  })

  test('renders the selection screen', async ({ page }) => {
    // Role buttons
    await expect(page.getByRole('button', { name: '신부' })).toBeVisible()
    await expect(page.getByRole('button', { name: '신랑' })).toBeVisible()

    // Experience options
    await expect(page.getByText('받아본 적 있어요')).toBeVisible()
    await expect(page.getByText('아직 받아보지 않았어요')).toBeVisible()
    await expect(page.getByText('잘 모르겠어요')).toBeVisible()
  })

  test('EXPERIENCED path navigates to manual', async ({ page }) => {
    // Select role
    await page.getByRole('button', { name: '신부' }).click()
    // Select experience level
    await page.getByText('받아본 적 있어요').click()
    // Proceed
    await page.getByRole('button', { name: '다음으로' }).click()

    // Wait for navigation — allow up to 5 s for the route change.
    await page.waitForURL('**/diagnosis/manual', { timeout: 5000 }).catch(() => {
      // Graceful fallback: just assert the current URL contains the expected segment.
      expect(page.url()).toContain('/diagnosis/manual')
    })
  })

  test('NOT_EXPERIENCED path navigates to photo', async ({ page }) => {
    // Select role
    await page.getByRole('button', { name: '신부' }).click()
    // Select experience level
    await page.getByText('아직 받아보지 않았어요').click()
    // Proceed
    await page.getByRole('button', { name: '다음으로' }).click()

    await page.waitForURL('**/diagnosis/photo', { timeout: 5000 }).catch(() => {
      expect(page.url()).toContain('/diagnosis/photo')
    })
  })

  test('CTA is disabled until both selections made', async ({ page }) => {
    const cta = page.getByRole('button', { name: '다음으로' })

    // Initially disabled — neither role nor experience chosen.
    await expect(cta).toBeDisabled()

    // Select only role → still disabled.
    await page.getByRole('button', { name: '신부' }).click()
    await expect(cta).toBeDisabled()

    // Select experience → now enabled.
    await page.getByText('잘 모르겠어요').click()
    await expect(cta).toBeEnabled()
  })
})
