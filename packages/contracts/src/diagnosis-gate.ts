import { z } from 'zod'

// ─── 도메인 열거형 ─────────────────────────────────────────────────────────────

export const DiagnosisExperienceEnum = z.enum([
  'EXPERIENCED',      // 이미 진단 받은 경험 있음
  'NOT_EXPERIENCED',  // 진단 경험 없음
  'UNSURE',           // 잘 모르겠음
])
export type DiagnosisExperience = z.infer<typeof DiagnosisExperienceEnum>

export const UserRoleEnum = z.enum(['BRIDE', 'GROOM'])
export type UserRole = z.infer<typeof UserRoleEnum>

// ─── 다음 라우팅 경로 ──────────────────────────────────────────────────────────

export const NextRouteEnum = z.enum([
  '/onboarding/personal-color-input',   // EXPERIENCED → 결과 직접 입력
  '/onboarding/photo-upload',           // NOT_EXPERIENCED → 사진 업로드 진단
  '/onboarding/survey',                 // UNSURE → 간단 설문
])
export type NextRoute = z.infer<typeof NextRouteEnum>

// ─── Request/Response DTO ──────────────────────────────────────────────────────

/** POST /profile/diagnosis-gate */
export const CreateDiagnosisGateRequestSchema = z.object({
  experience: DiagnosisExperienceEnum,
  role: UserRoleEnum,
})
export type CreateDiagnosisGateRequest = z.infer<typeof CreateDiagnosisGateRequestSchema>

/** GET /profile/diagnosis-gate 응답 + POST 응답 공용 */
export const DiagnosisGateResponseSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  experience: DiagnosisExperienceEnum,
  role: UserRoleEnum,
  nextRoute: NextRouteEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type DiagnosisGateResponse = z.infer<typeof DiagnosisGateResponseSchema>

// ─── 라우팅 결정 헬퍼 ─────────────────────────────────────────────────────────

export function resolveNextRoute(experience: DiagnosisExperience): NextRoute {
  const map: Record<DiagnosisExperience, NextRoute> = {
    EXPERIENCED:     '/onboarding/personal-color-input',
    NOT_EXPERIENCED: '/onboarding/photo-upload',
    UNSURE:          '/onboarding/survey',
  }
  return map[experience]
}
