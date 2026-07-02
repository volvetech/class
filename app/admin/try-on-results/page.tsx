'use client'

import React, { useState, useEffect } from 'react'

interface Result {
  id: number
  jobId: number
  resultImageUrl: string | null
  thumbnailUrl: string | null
  qualityScore: number | null
  isSaved: boolean
  isDownloaded: boolean
  createdAt: string
  email: string | null
  jobStatus: string | null
}

interface ResultsResponse {
  data: Result[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function TryOnResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [jobId, setJobId] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchResults = async () => {
    setLoading(true)
    const url = new URL('/api/admin/results', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (jobId) url.searchParams.set('jobId', jobId)

    const res = await fetch(url)
    const data: ResultsResponse = await res.json()
    setResults(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchResults()
  }, [page, jobId])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Try-on Results</h1>
          <p className="text-gray-400 mt-1">试衣结果管理</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索任务 ID..."
              value={jobId}
              onChange={(e) => { setJobId(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">Job ID</th>
                    <th className="pb-4 font-medium">Preview</th>
                    <th className="pb-4 font-medium">Quality Score</th>
                    <th className="pb-4 font-medium">Saved</th>
                    <th className="pb-4 font-medium">Downloaded</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 text-white">{result.id}</td>
                      <td className="py-4 text-white">{result.jobId}</td>
                      <td className="py-4">
                        {result.resultImageUrl ? (
                          <img
                            src={result.resultImageUrl}
                            alt="Result"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 text-gray-300">{result.qualityScore || '-'}</td>
                      <td className="py-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${result.isSaved ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${result.isDownloaded ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      </td>
                      <td className="py-4 text-gray-300">{result.email || '-'}</td>
                      <td className="py-4 text-gray-400 text-sm">{new Date(result.createdAt).toLocaleString()}</td>
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