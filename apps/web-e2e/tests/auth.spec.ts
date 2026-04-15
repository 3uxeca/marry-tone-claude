/**
 * Auth API smoke tests.
 *
 * These are pure API-level tests using Playwright's `request` fixture.
 * They do NOT require the Next.js app to be running, but DO require
 * the API server to be up:
 *
 *   docker compose up   OR   pnpm dev (from repo root)
 *
 * The API base URL defaults to http://localhost:4000.
 */

import { test, expect } from '@playwright/test'

const API_BASE = process.env.API_URL ?? 'http://localhost:4000'

test.describe('Auth API', () => {
  test('register creates a user', async ({ request }) => {
    const email = `test-${Date.now()}@example.com`

    const res = await request.post(`${API_BASE}/api/auth/register`, {
      data: { email, password: 'TestPass123!', name: 'Test User' },
    })

    expect(res.status()).toBe(201)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.user.email).toBe(email)
  })

  test('login returns user', async ({ request }) => {
    const email = `test-${Date.now()}@example.com`

    // First register
    await request.post(`${API_BASE}/api/auth/register`, {
      data: { email, password: 'TestPass123!', name: 'Test User' },
    })

    // Then login
    const loginRes = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email, password: 'TestPass123!' },
    })

    expect(loginRes.status()).toBe(200)

    const body = await loginRes.json()
    expect(body.success).toBe(true)
  })

  test('me requires auth', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/auth/me`)

    expect(res.status()).toBe(401)
  })
})
