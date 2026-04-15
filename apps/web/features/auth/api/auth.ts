const API_BASE = '/api'

export interface RegisterPayload { email: string; password: string; name: string }
export interface LoginPayload { email: string; password: string }
export interface AuthUser { id: string; email: string; name: string }

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? 'Registration failed')
  }
  const json = await res.json()
  return json.data.user as AuthUser
}

export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? 'Login failed')
  }
  const json = await res.json()
  return json.data.user as AuthUser
}
