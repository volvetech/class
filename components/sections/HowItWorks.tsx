'use client'

import { Upload, FileText, Sparkles, Download } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Images',
    description: 'Upload a person photo and item images (clothes, pants, hairstyles, shoes, glasses) to get started with your virtual try-on.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Fill in the Prompt',
    description: 'Describe the try-on you want with detailed prompt words. Our advanced AI will process your instructions to create realistic results.',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Generate',
    description: 'Click the "Generate" button and wait for our engine to handle masking, alignment, and blending.',
  },
  {
    icon: Download,
    step: '04',
    title: 'Download',
    description: 'Download your stunning virtual try-on image when complete.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">How to Use</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Simple steps to create your perfect virtual try-on experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="card-gold rounded-2xl p-8 h-full">
                <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-500/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="group flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-xl hover:opacity-90 transition-all">
            Try Free Now
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}