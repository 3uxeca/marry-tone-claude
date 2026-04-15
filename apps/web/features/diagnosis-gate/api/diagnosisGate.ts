import type {
  CreateDiagnosisGateRequest,
  DiagnosisGateResponse,
} from '@marry-tone/contracts'

export type { CreateDiagnosisGateRequest, DiagnosisGateResponse }
export type { DiagnosisExperience, UserRole } from '@marry-tone/contracts'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export async function postDiagnosisGate(
  payload: CreateDiagnosisGateRequest,
): Promise<DiagnosisGateResponse> {
  const res = await fetch(`${API_BASE}/profile/diagnosis-gate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save diagnosis gate')
  const json = await res.json()
  return json.data as DiagnosisGateResponse
}

export async function getDiagnosisGate(): Promise<DiagnosisGateResponse> {
  const res = await fetch(`${API_BASE}/profile/diagnosis-gate`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch diagnosis gate')
  const json = await res.json()
  return json.data as DiagnosisGateResponse
}
