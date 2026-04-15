import { z } from 'zod'

/** POST /auth/login */
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

/** POST /auth/register */
export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(50),
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

/** GET /auth/me 응답 */
export const MeResponseSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.string().datetime(),
})
export type MeResponse = z.infer<typeof MeResponseSchema>
