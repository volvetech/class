'use client'

import React, { useState, useCallback } from 'react'

interface ImageUploaderProps {
  label: string
  onImageSelect: (imageUrl: string) => void
  preview?: string
}

export default function ImageUploader({ label, onImageSelect, preview }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [useUrl, setUseUrl] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }, [])

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      onImageSelect(result)
    }
    reader.readAsDataURL(file)
  }

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return ['http:', 'https:'].includes(urlObj.protocol) && 
             /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname)
    } catch {
      return false
    }
  }

  const handleUrlSubmit = () => {
    if (!urlValue.trim()) {
      setUrlError('请输入图片 URL')
      return
    }
    if (!validateUrl(urlValue)) {
      setUrlError('请输入有效的图片 URL（支持 jpg, png, gif, webp）')
      return
    }
    setUrlError('')
    onImageSelect(urlValue.trim())
  }

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit()
    }
  }

  return (
    <div>
      <div className="input-switch">
        <button
          className={!useUrl ? 'active' : ''}
          onClick={() => { setUseUrl(false); setUrlError('') }}
        >
          📁 上传本地图片
        </button>
        <button
          className={useUrl ? 'active' : ''}
          onClick={() => { setUseUrl(true); setUrlError('') }}
        >
          🔗 输入图片 URL
        </button>
      </div>

      {useUrl ? (
        <div className="upload-area">
          <input
            key="url-input"
            type="text"
            placeholder={`请输入图片 URL...`}
            value={urlValue}
            onChange={(e) => { setUrlValue(e.target.value); setUrlError('') }}
            onKeyPress={handleUrlKeyPress}
            className="url-input"
          />
          {urlError && (
            <p className="error-message">⚠️ {urlError}</p>
          )}
          <button
            className="btn w-full mt-4"
            onClick={handleUrlSubmit}
            disabled={!urlValue.trim()}
          >
            ✅ 确认使用此图片
          </button>
        </div>
      ) : (
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`upload-${label}`)?.click()}
        >
          <input
            key="file-input"
            id={`upload-${label}`}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          {preview ? (
            <div>
              <img src={preview} alt={label} className="image-preview" />
              <p className="text-secondary mt-4">点击更换图片</p>
            </div>
          ) : (
            <div>
              <div className="upload-icon">📷</div>
              <h3 className="text-lg font-semibold text-white mb-2">拖拽或点击上传</h3>
              <p className="text-secondary">支持 JPG、PNG、GIF 格式</p>
              <p className="text-muted text-sm mt-1">文件大小不超过 10MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}