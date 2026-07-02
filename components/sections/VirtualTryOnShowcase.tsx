'use client'

import { useState } from 'react'
import { Check, Plus, ArrowRight } from 'lucide-react'

const features = [
  'Precise Body Recognition',
  'Multiple Clothing Styles',
  'Real-Time Try-On Effect',
  '360-Degree Display',
]

const defaultImages = [
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=elegant%20white%20blouse%20with%20floral%20pattern%20on%20white%20background&image_size=square',
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20lace%20hat%20vintage%20style%20on%20white%20background&image_size=square',
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=navy%20blue%20long%20skirt%20elegant%20style%20on%20white%20background&image_size=square',
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=african%20american%20woman%20sitting%20elegant%20pose%20fashion%20model&image_size=square',
]

const resultImage = 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=african%20american%20woman%20wearing%20white%20blouse%20and%20blue%20skirt%20with%20white%20hat%20sitting%20on%20victorian%20building%20porch%20holding%20a%20cat%20professional%20fashion%20photography&image_size=landscape_4_3'

export function VirtualTryOnShowcase() {
  const [images, setImages] = useState<string[]>(defaultImages)
  const [selectedImages, setSelectedImages] = useState<number[]>([0, 1, 2, 3])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && images.length < 6) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages([...images, event.target?.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleImageSelection = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter(i => i !== index))
    } else {
      setSelectedImages([...selectedImages, index])
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-gold rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                  Outfit Try-On
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Virtual Outfit Try-On
              </h2>

              <p className="text-gray-400 mb-6 leading-relaxed">
                Try on different clothing styles in one click without a physical fitting room.
                AI accurately identifies body shape and presents realistic wearing effects,
                making online shopping more intelligent and convenient.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-xl hover:opacity-90 transition-all hover:scale-[1.02]">
                <span className="w-5 h-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </span>
                Try for Free
              </button>
            </div>

            <div className="lg:col-span-4 flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => toggleImageSelection(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all group ${
                      selectedImages.includes(index)
                        ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-black'
                        : 'hover:ring-1 hover:ring-white/30'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImages.includes(index) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 6 && (
                  <label
                    className="relative aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImage}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">Prompt:</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Dress the model in the clothes and hat. Add a cat to the scene and change the background to a Victorian era building.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="h-full rounded-2xl bg-black/50 border border-white/10 overflow-hidden relative">
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                    AI Result
                  </span>
                </div>

                <div className="p-4 pt-12">
                  <img
                    src={resultImage}
                    alt="AI Result"
                    className="w-full rounded-xl aspect-video object-cover"
                  />
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                      isGenerating
                        ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-400'
                        : 'border-white/20 text-white hover:border-yellow-500/50 hover:text-yellow-400'
                    } transition-all`}
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}