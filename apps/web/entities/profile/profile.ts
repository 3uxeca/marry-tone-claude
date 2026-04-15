import type { DiagnosisExperience, UserRole } from '@marry-tone/contracts'

export interface Profile {
  id: string
  userId: string
  role: UserRole
  diagnosisExperience?: DiagnosisExperience
  personalColor?: string
  skeletonType?: 'STRAIGHT' | 'WAVE' | 'NATURAL'
  createdAt: string
}
