'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

type Experience = 'EXPERIENCED' | 'NOT_EXPERIENCED' | 'UNSURE'
type WeddingRole = 'BRIDE' | 'GROOM'

interface DiagnosisGateFormProps {
  onSubmit: (experience: Experience, weddingRole: WeddingRole) => void
  isLoading?: boolean
}

const EXPERIENCE_OPTIONS: { value: Experience; label: string; subtitle: string; icon: string }[] = [
  {
    value: 'EXPERIENCED',
    label: '받아본 적 있어요',
    subtitle: '진단 결과를 직접 입력할게요',
    icon: '✓',
  },
  {
    value: 'NOT_EXPERIENCED',
    label: '아직 받아보지 않았어요',
    subtitle: '사진으로 AI 진단을 받아볼게요',
    icon: '📷',
  },
  {
    value: 'UNSURE',
    label: '잘 모르겠어요',
    subtitle: '간단한 설문으로 확인해드릴게요',
    icon: '?',
  },
]

export function DiagnosisGateForm({ onSubmit, isLoading = false }: DiagnosisGateFormProps) {
  const [selectedRole, setSelectedRole] = useState<WeddingRole | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)

  const canSubmit = selectedRole !== null && selectedExperience !== null

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(selectedExperience, selectedRole)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Wedding Role Selector */}
      <section>
        <p className="text-sm font-medium text-stone-500 mb-3">나는</p>
        <div className="flex gap-3">
          {(['BRIDE', 'GROOM'] as const).map((role) => {
            const isSelected = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={[
                  'flex-1 py-3 px-4 rounded-full border-2 text-sm font-semibold transition-all duration-200 active:scale-95 min-h-[44px]',
                  isSelected
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400',
                ].join(' ')}
              >
                {role === 'BRIDE' ? '신부 👰' : '신랑 🤵'}
              </button>
            )
          })}
        </div>
      </section>

      {/* Divider — tonal, no hard line */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      {/* Experience Question */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-800 leading-snug">
            퍼스널 컬러 &amp; 골격 진단을
          </h2>
          <h2 className="text-lg font-semibold text-stone-800 leading-snug">
            받아본 적 있나요?
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {EXPERIENCE_OPTIONS.map((option) => {
            const isSelected = selectedExperience === option.value
            return (
              <Card
                key={option.value}
                hoverable
                selected={isSelected}
                onClick={() => setSelectedExperience(option.value)}
                className={[
                  'px-5 py-4 flex items-center gap-4 cursor-pointer',
                  isSelected ? 'bg-[#fdfbf7]' : 'bg-white',
                ].join(' ')}
              >
                {/* Icon bubble */}
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-200',
                    isSelected
                      ? 'bg-stone-800 text-white'
                      : 'bg-accent-blush-light text-stone-600',
                  ].join(' ')}
                >
                  {option.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-0.5">
                  <span
                    className={[
                      'text-sm font-semibold transition-colors duration-200',
                      isSelected ? 'text-stone-800' : 'text-stone-700',
                    ].join(' ')}
                  >
                    {option.label}
                  </span>
                  <span className="text-xs text-stone-500">{option.subtitle}</span>
                </div>

                {/* Selection indicator */}
                <div className="ml-auto shrink-0">
                  <div
                    className={[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                      isSelected
                        ? 'border-stone-800 bg-stone-800'
                        : 'border-stone-300 bg-white',
                    ].join(' ')}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 10 8"
                        fill="none"
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4l2.5 2.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSubmit}
        loading={isLoading}
        onClick={handleSubmit}
        className="rounded-full mt-2"
      >
        다음으로
      </Button>
    </div>
  )
}
