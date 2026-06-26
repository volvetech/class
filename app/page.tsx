'use client'

import React, { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'

type Step = 'upload' | 'analyzing' | 'processing' | 'result'
type ClothingCategory = 'top' | 'bottom' | 'dress'

export default function Home() {
  const [step, setStep] = useState<Step>('upload')
  const [personImage, setPersonImage] = useState<string>('')
  const [clothingImage, setClothingImage] = useState<string>('')
  const [category, setCategory] = useState<ClothingCategory | null>(null)
  const [resultImage, setResultImage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState(0)

  const handlePersonSelect = (image: string) => {
    setPersonImage(image)
    setError('')
  }

  const handleClothingSelect = (image: string) => {
    setClothingImage(image)
    setError('')
  }

  const handleStart = async () => {
    if (!personImage || !clothingImage) return

    setStep('analyzing')
    setError('')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 30))
    }, 150)

    try {
      const classifyResponse = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clothingImage }),
      })

      const classifyData = await classifyResponse.json()

      if (!classifyResponse.ok) {
        throw new Error(classifyData.error || '服装分类失败')
      }

      clearInterval(progressInterval)
      setProgress(30)

      const detectedCategory = classifyData.category as ClothingCategory
      setCategory(detectedCategory)

      await handleTryOn(detectedCategory)

    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : '分类过程中发生错误')
      setStep('upload')
    }
  }

  const handleTryOn = async (detectedCategory: ClothingCategory) => {
    setStep('processing')
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 95))
    }, 150)

    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personImage,
          clothingImage,
          category: detectedCategory,
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '试衣失败')
      }

      if (data.result_image) {
        setResultImage(data.result_image)
        setStep('result')
      } else {
        throw new Error('未返回试衣结果')
      }

    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : '试衣过程中发生错误')
      setStep('upload')
    }
  }

  const handleReset = () => {
    setStep('upload')
    setPersonImage('')
    setClothingImage('')
    setCategory(null)
    setResultImage('')
    setError('')
    setProgress(0)
  }

  const categoryLabels: Record<ClothingCategory, string> = {
    top: '上装',
    bottom: '下装',
    dress: '连衣裙',
  }

  const categoryEmojis: Record<ClothingCategory, string> = {
    top: '👕',
    bottom: '👖',
    dress: '👗',
  }

  const getStepStatus = () => {
    switch (step) {
      case 'upload': return { current: 1, completed: 0 }
      case 'analyzing': return { current: 2, completed: 1 }
      case 'processing': return { current: 3, completed: 2 }
      case 'result': return { current: 4, completed: 3 }
    }
  }

  const stepInfo = getStepStatus()

  return (
    <div className="container py-12">
      <header className="page-header">
        <h1 className="page-title">Virtual Try-On AI</h1>
        <p className="page-subtitle">上传照片和服装，快速获得虚拟试衣效果</p>
      </header>

      <div className="step-indicator">
        {[
          { label: '上传图片', icon: '📷' },
          { label: 'AI 识别', icon: '🤖' },
          { label: '生成效果', icon: '✨' },
          { label: '完成', icon: '✅' },
        ].map((item, index) => (
          <div key={index} className="step-item">
            <div className={`step-dot ${stepInfo.current === index + 1 ? 'active' : stepInfo.completed >= index + 1 ? 'completed' : ''}`}></div>
            <span className={`step-label ${stepInfo.current === index + 1 ? 'active' : ''}`}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        {step === 'upload' && (
          <div className="fade-in">
            <div className="mb-8">
              <h2 className="section-title">上传图片</h2>
              <p className="section-subtitle">请上传一张人物照片和一张服装图片</p>
            </div>
            
            <div className="grid">
              <div>
                <label className="block text-white font-semibold mb-4 text-lg">📸 人物照片</label>
                <ImageUploader
                  label="person"
                  onImageSelect={handlePersonSelect}
                  preview={personImage}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-4 text-lg">👗 服装图片</label>
                <ImageUploader
                  label="clothing"
                  onImageSelect={handleClothingSelect}
                  preview={clothingImage}
                />
              </div>
            </div>
            
            {error && (
              <div className="error-message text-center mt-6">
                ⚠️ {error}
              </div>
            )}
            
            <div className="mt-10 text-center">
              <button
                className="btn"
                onClick={handleStart}
                disabled={!personImage || !clothingImage}
              >
                🚀 开始试衣
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="text-center py-16 fade-in">
            <div className="spinner mx-auto mb-8"></div>
            <h2 className="section-title mb-4">AI 正在识别服装...</h2>
            <p className="text-secondary mb-8">请稍候，系统正在分析服装类别</p>
            <div className="max-w-md mx-auto">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-muted mt-3 text-sm">{progress}% 完成</p>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-16 fade-in">
            <div className="spinner mx-auto mb-8"></div>
            <h2 className="section-title mb-4">正在生成试衣效果...</h2>
            {category && (
              <div className={`category-badge ${category} mb-6 inline-flex items-center gap-2`}>
                <span>{categoryEmojis[category]}</span>
                <span>已识别：{categoryLabels[category]}</span>
              </div>
            )}
            <p className="text-secondary mb-8">AI 正在处理您的图片，请耐心等待</p>
            <div className="max-w-md mx-auto">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-muted mt-3 text-sm">{progress}% 完成</p>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="section-title">试衣效果已生成</h2>
              <p className="section-subtitle">查看您的虚拟试衣效果</p>
            </div>
            
            {category && (
              <div className={`category-badge ${category} mb-6`}>
                {categoryEmojis[category]} {categoryLabels[category]}
              </div>
            )}
            
            <div className="mb-8 relative inline-block scale-in">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <img src={resultImage} alt="Result" className="result-image relative z-10" />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="btn btn-secondary" onClick={handleReset}>
                🔄 重新试衣
              </button>
              <button className="btn" onClick={() => window.open(resultImage, '_blank')}>
                📥 下载图片
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-12 text-muted text-sm">
        <p>Powered by Agnes AI | Virtual Try-On V1.0</p>
        <p className="mt-2 text-xs">© 2026 Virtual Try-On Tool</p>
      </footer>
    </div>
  )
}