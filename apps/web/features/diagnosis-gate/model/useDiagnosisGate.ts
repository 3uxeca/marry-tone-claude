'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  postDiagnosisGate,
  getDiagnosisGate,
} from '../api/diagnosisGate'
import type { CreateDiagnosisGateRequest } from '../api/diagnosisGate'

export function useDiagnosisGateQuery() {
  return useQuery({
    queryKey: ['diagnosis-gate'],
    queryFn: getDiagnosisGate,
    retry: false,
  })
}

export function useDiagnosisGateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDiagnosisGateRequest) => postDiagnosisGate(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['diagnosis-gate'], data)
    },
  })
}
