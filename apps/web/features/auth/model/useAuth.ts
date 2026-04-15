'use client'
import { useMutation } from '@tanstack/react-query'
import { registerUser, loginUser, RegisterPayload, LoginPayload } from '../api/auth'

export function useRegister() {
  return useMutation({ mutationFn: (p: RegisterPayload) => registerUser(p) })
}

export function useLogin() {
  return useMutation({ mutationFn: (p: LoginPayload) => loginUser(p) })
}
