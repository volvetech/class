'use client'

import React, { useState, useEffect } from 'react'

interface Feedback {
  id: number
  userId: number | null
  email: string | null
  jobId: number | null
  resultId: number | null
  rating: number | null
  feedbackTags: string[] | null
  comment: string | null
  createdAt: string
  resultImageUrl: string | null
}

interface FeedbackResponse {
  data: Feedback[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchFeedback = async () => {
    setLoading(true)
    const url = new URL('/api/admin/feedback', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (search) url.searchParams.set('search', search)
    if (rating) url.searchParams.set('rating', rating)

    const res = await fetch(url)
    const data: FeedbackResponse = await res.json()
    setFeedbackList(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchFeedback()
  }, [page, search, rating])

  const renderStars = (count: number | null) => {
    if (!count) return '-'
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-500'}>★</span>
    ))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
          <p className="text-gray-400 mt-1">用户反馈管理</p>
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
            value={rating}
            onChange={(e) => { setRating(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">所有评分</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : feedbackList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        ) : (
          <>
            <div className="space-y-4">
              {feedbackList.map((feedback) => (
                <div key={feedback.id} className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">ID: {feedback.id}</span>
                      <span className="text-gray-300">{feedback.email || '-'}</span>
                      <span className="text-yellow-400">{renderStars(feedback.rating)}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{new Date(feedback.createdAt).toLocaleString()}</span>
                  </div>
                  
                  {feedback.resultImageUrl && (
                    <div className="mt-4">
                      <img
                        src={feedback.resultImageUrl}
                        alt="Result"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}
                  
                  {feedback.comment && (
                    <p className="mt-4 text-gray-300">{feedback.comment}</p>
                  )}
                  
                  {feedback.feedbackTags && feedback.feedbackTags.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {feedback.feedbackTags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-600/30 text-purple-300 text-sm rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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