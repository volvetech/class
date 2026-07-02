'use client'

import React, { useState, useEffect } from 'react'

interface PersonImage {
  id: number
  userId: number | null
  email: string | null
  fileUrl: string
  width: number | null
  height: number | null
  fileSize: number | null
  status: string
  isDefault: boolean
  createdAt: string
}

interface PersonImagesResponse {
  data: PersonImage[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function PersonImagesPage() {
  const [images, setImages] = useState<PersonImage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchImages = async () => {
    setLoading(true)
    const url = new URL('/api/admin/person-images', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (search) url.searchParams.set('search', search)
    if (status) url.searchParams.set('status', status)

    const res = await fetch(url)
    const data: PersonImagesResponse = await res.json()
    setImages(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [page, search, status])

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Person Images</h1>
          <p className="text-gray-400 mt-1">人物照片管理</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索用户邮箱..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="disabled">禁用</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">Preview</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Size</th>
                    <th className="pb-4 font-medium">Dimensions</th>
                    <th className="pb-4 font-medium">Default</th>
                    <th className="pb-4 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => (
                    <tr key={image.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 text-white">{image.id}</td>
                      <td className="py-4">
                        <img
                          src={image.fileUrl}
                          alt="Person"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4 text-gray-300">{image.email || '-'}</td>
                      <td className="py-4 text-gray-400 text-sm">{formatFileSize(image.fileSize)}</td>
                      <td className="py-4 text-gray-400 text-sm">
                        {image.width && image.height ? `${image.width}x${image.height}` : '-'}
                      </td>
                      <td className="py-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${image.isDefault ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      </td>
                      <td className="py-4 text-gray-400 text-sm">{new Date(image.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                共 {pagination.total} 条记录
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="px-4 py-2 text-gray-300">{page} / {pagination.pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}