'use client'

import React from 'react'

export type ClothingCategory = 'top' | 'bottom' | 'dress'

interface CategorySelectorProps {
  selected: ClothingCategory | null
  onChange: (category: ClothingCategory) => void
}

const categories: { value: ClothingCategory; label: string; emoji: string; color: string }[] = [
  { value: 'top', label: '上装', emoji: '👕', color: 'top' },
  { value: 'bottom', label: '下装', emoji: '👖', color: 'bottom' },
  { value: 'dress', label: '连衣裙', emoji: '👗', color: 'dress' },
]

export default function CategorySelector({ selected, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            selected === cat.value
              ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
              : 'border-gray-200 bg-white hover:border-purple-300'
          }`}
        >
          <div className="text-4xl mb-3">{cat.emoji}</div>
          <div className={`font-semibold ${selected === cat.value ? 'text-purple-700' : 'text-gray-700'}`}>
            {cat.label}
          </div>
        </button>
      ))}
    </div>
  )
}