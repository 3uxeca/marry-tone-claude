'use client'

import { useRouter } from 'next/navigation'
import { DiagnosisGateForm } from '@/features/diagnosis-gate/ui/DiagnosisGateForm'
import { useDiagnosisGateMutation } from '@/features/diagnosis-gate/model/useDiagnosisGate'
import type { DiagnosisExperience, UserRole } from '@/features/diagnosis-gate/api/diagnosisGate'

export default function DiagnosisGatePage() {
  const router = useRouter()
  const mutation = useDiagnosisGateMutation()

  function handleSubmit(experience: DiagnosisExperience, role: UserRole) {
    mutation.mutate(
      { experience, role },
      {
        onSuccess: (data) => router.push(data.nextRoute),
      },
    )
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-md mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-2">
            진단 시작
          </p>
          <h1 className="text-2xl font-semibold text-stone-800 leading-tight">
            나만의 웨딩 스타일을
            <br />
            찾아볼게요 ✨
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            몇 가지 질문으로 딱 맞는 진단 방식을 안내해드려요.
          </p>
        </div>

        <DiagnosisGateForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
      </div>
    </main>
  )
}
