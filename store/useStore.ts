'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuizAnswers, SavedItem, StyleItem } from '@/lib/types'

interface AppState {
  // 퀴즈 답변
  quizAnswers: QuizAnswers
  setQuizAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void
  resetQuiz: () => void

  // 저장된 아이템들 (스타일보드)
  savedItems: SavedItem[]
  saveItem: (item: StyleItem, note?: string) => void
  removeItem: (id: string) => void
  updateNote: (id: string, note: string) => void
  setRank: (id: string, rank: 1 | 2 | 3) => void
  isItemSaved: (itemId: string) => boolean

  // 비교할 아이템 (최대 2개)
  compareItems: string[]  // SavedItem ids
  toggleCompare: (id: string) => void
  clearCompare: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      quizAnswers: {},

      setQuizAnswer: (key, value) =>
        set(state => ({ quizAnswers: { ...state.quizAnswers, [key]: value } })),

      resetQuiz: () => set({ quizAnswers: {} }),

      savedItems: [],

      saveItem: (item, note) => {
        const exists = get().savedItems.find(s => s.item.id === item.id)
        if (exists) return
        const newItem: SavedItem = {
          id: `saved-${Date.now()}`,
          item,
          note,
          savedAt: new Date().toISOString(),
        }
        set(state => ({ savedItems: [newItem, ...state.savedItems] }))
      },

      removeItem: (id) =>
        set(state => ({
          savedItems: state.savedItems.filter(s => s.id !== id),
          compareItems: state.compareItems.filter(c => c !== id),
        })),

      updateNote: (id, note) =>
        set(state => ({
          savedItems: state.savedItems.map(s => s.id === id ? { ...s, note } : s),
        })),

      setRank: (id, rank) =>
        set(state => ({
          savedItems: state.savedItems.map(s => s.id === id ? { ...s, rank } : s),
        })),

      isItemSaved: (itemId) => get().savedItems.some(s => s.item.id === itemId),

      compareItems: [],

      toggleCompare: (id) =>
        set(state => {
          const exists = state.compareItems.includes(id)
          if (exists) return { compareItems: state.compareItems.filter(c => c !== id) }
          if (state.compareItems.length >= 2) return { compareItems: [state.compareItems[1], id] }
          return { compareItems: [...state.compareItems, id] }
        }),

      clearCompare: () => set({ compareItems: [] }),
    }),
    {
      name: 'marry-tone-store',
    }
  )
)
