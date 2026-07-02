'use client'

import { Check, ScanLine, Palette, RotateCcw, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: ScanLine,
    title: 'Precise Body Recognition',
    description: 'Advanced AI accurately identifies body shape and size for perfect fitting results.',
  },
  {
    icon: Palette,
    title: 'Multiple Clothing Styles',
    description: 'Support for various clothing types including tops, pants, dresses, and accessories.',
  },
  {
    icon: Zap,
    title: 'Real-Time Try-On Effect',
    description: 'Instantly see how clothes look on you with real-time rendering technology.',
  },
  {
    icon: RotateCcw,
    title: '360-Degree Display',
    description: 'View your outfit from all angles with our comprehensive viewing options.',
  },
  {
    icon: Shield,
    title: 'Privacy Protection',
    description: 'Your photos are processed securely and never stored without permission.',
  },
  {
    icon: Check,
    title: 'High-Quality Output',
    description: 'Professional-grade images suitable for both personal and commercial use.',
  },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
            <Check className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Outfit Try-On</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">Virtual Outfit Try-On</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Try on different clothing styles in one click without a physical fitting room. 
            AI accurately identifies body shape and presents realistic wearing effects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl card-gold hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="group flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-xl hover:opacity-90 transition-all">
            Try for Free
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}