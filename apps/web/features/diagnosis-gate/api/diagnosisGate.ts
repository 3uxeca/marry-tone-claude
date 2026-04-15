import type {
  CreateDiagnosisGateRequest,
  DiagnosisGateResponse,
} from '@marry-tone/contracts'

export type { CreateDiagnosisGateRequest, DiagnosisGateResponse }
export type { DiagnosisExperience, UserRole } from '@marry-tone/contracts'

// Next.js rewrites /api/* → API server (see next.config.js)
// 상대 경로 사용으로 CORS 없음, 포트 하드코딩 없음
const API_BASE = '/api'

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
