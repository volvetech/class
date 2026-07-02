'use client'

import { motion } from 'motion/react'

interface BackgroundCirclesProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary'
}

const COLOR_VARIANTS = {
  primary: {
    border: ['rgba(16, 185, 129, 0.6)', 'rgba(34, 211, 238, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(16, 185, 129, 0.3)',
  },
  secondary: {
    border: ['rgba(139, 92, 246, 0.6)', 'rgba(217, 70, 239, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(139, 92, 246, 0.3)',
  },
  tertiary: {
    border: ['rgba(249, 115, 22, 0.6)', 'rgba(250, 204, 21, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(249, 115, 22, 0.3)',
  },
  quaternary: {
    border: ['rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(168, 85, 247, 0.3)',
  },
  quinary: {
    border: ['rgba(239, 68, 68, 0.6)', 'rgba(244, 63, 94, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(239, 68, 68, 0.3)',
  },
  senary: {
    border: ['rgba(59, 130, 246, 0.6)', 'rgba(14, 165, 233, 0.5)', 'rgba(71, 85, 105, 0.3)'],
    gradient: 'rgba(59, 130, 246, 0.3)',
  },
}

export function BackgroundCircles({ variant = 'secondary' }: BackgroundCirclesProps) {
  const colors = COLOR_VARIANTS[variant]

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: `1px solid ${colors.border[0]}`,
          background: `radial-gradient(circle, ${colors.gradient}, transparent)`,
          opacity: 0.6,
          top: 0,
          left: 0,
        }}
        animate={{
          x: ['-50%', '50%'],
          y: ['-50%', '50%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: `1px solid ${colors.border[1]}`,
          background: `radial-gradient(circle, ${colors.gradient}, transparent)`,
          opacity: 0.5,
          bottom: 0,
          right: 0,
        }}
        animate={{
          x: ['50%', '-50%'],
          y: ['50%', '-50%'],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `1px solid ${colors.border[2]}`,
          background: `radial-gradient(circle, ${colors.gradient}, transparent)`,
          opacity: 0.4,
          top: '50%',
          left: '50%',
        }}
        animate={{
          x: ['0%', '100%'],
          y: ['100%', '0%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}