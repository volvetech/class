'use client'

import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-400 text-sm font-medium">AI-Powered Virtual Try-On Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gradient-gold">Experience Realistic</span>
          <br />
          <span className="text-white">Try-On Results</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Try on different clothing styles in one click without a physical fitting room. 
          AI accurately identifies body shape and presents realistic wearing effects.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-xl hover:opacity-90 transition-all hover:scale-105">
            Start Try-On Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '50K+', label: 'Users' },
            { value: '1M+', label: 'Generated' },
            { value: '98%', label: 'Accuracy' },
            { value: '5s', label: 'Avg Time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}