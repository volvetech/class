'use client'

import { useState } from 'react'
import { Upload, Image, ArrowRight, Download, RefreshCw } from 'lucide-react'

export function TryOnDemo() {
  const [personImage, setPersonImage] = useState<string>('')
  const [clothingImage, setClothingImage] = useState<string>('')
  const [resultImage, setResultImage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPersonImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setClothingImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both person and clothing images')
      return
    }

    setError('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage,
          clothingImage,
          category: 'top',
        }),
      })

      const data = await response.json()

      if (response.ok && data.result_image) {
        setResultImage(data.result_image)
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setPersonImage('')
    setClothingImage('')
    setResultImage('')
    setError('')
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">Try It Yourself</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload your photo and clothing image to see realistic try-on results
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-gold rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-yellow-400" />
                Person Photo
              </h3>
              <div
                className={`relative w-full aspect-square rounded-xl border-2 border-dashed ${
                  personImage ? 'border-yellow-500/50' : 'border-white/20'
                } flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/70 transition-colors overflow-hidden`}
                onClick={() => document.getElementById('person-upload')?.click()}
              >
                {personImage ? (
                  <img src={personImage} alt="Person" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-sm">Click to upload</p>
                    <p className="text-gray-500 text-xs mt-2">JPG, PNG supported</p>
                  </>
                )}
                <input
                  id="person-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePersonUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleGenerate}
                disabled={!personImage || !clothingImage || isProcessing}
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all ${
                  personImage && clothingImage && !isProcessing
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-600 text-black hover:scale-110 cursor-pointer'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <div className="w-8 h-8 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-8 h-8" />
                )}
              </button>
              <p className="text-gray-400 text-sm mt-4">Generate</p>
            </div>

            <div className="card-gold rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-yellow-400" />
                Clothing Image
              </h3>
              <div
                className={`relative w-full aspect-square rounded-xl border-2 border-dashed ${
                  clothingImage ? 'border-yellow-500/50' : 'border-white/20'
                } flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/70 transition-colors overflow-hidden`}
                onClick={() => document.getElementById('clothing-upload')?.click()}
              >
                {clothingImage ? (
                  <img src={clothingImage} alt="Clothing" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-sm">Click to upload</p>
                    <p className="text-gray-500 text-xs mt-2">JPG, PNG supported</p>
                  </>
                )}
                <input
                  id="clothing-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleClothingUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {resultImage && (
            <div className="mt-8 card-gold rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Result
              </h3>
              <div className="relative w-full max-w-2xl mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl" />
                <img src={resultImage} alt="Result" className="relative z-10 w-full rounded-2xl" />
              </div>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => window.open(resultImage, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}