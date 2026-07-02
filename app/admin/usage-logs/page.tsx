'use client'

import React, { useState, useEffect } from 'react'

interface UsageLog {
  id: number
  userId: number | null
  email: string | null
  jobId: number | null
  usageType: string
  creditChange: number
  createdAt: string
}

interface UsageLogsResponse {
  data: UsageLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function UsageLogsPage() {
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [usageType, setUsageType] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchLogs = async () => {
    setLoading(true)
    const url = new URL('/api/admin/usage-logs', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (search) url.searchParams.set('search', search)
    if (usageType) url.searchParams.set('usageType', usageType)

    const res = await fetch(url)
    const data: UsageLogsResponse = await res.json()
    setLogs(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [page, search, usageType])

  const typeColors: Record<string, string> = {
    tryon: 'bg-blue-500',
    credit_add: 'bg-green-500',
    credit_consume: 'bg-red-500',
    refund: 'bg-yellow-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Usage Logs</h1>
          <p className="text-gray-400 mt-1">使用记录管理</p>
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
            value={usageType}
            onChange={(e) => { setUsageType(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">所有类型</option>
            <option value="tryon">试衣</option>
            <option value="credit_add">充值</option>
            <option value="credit_consume">消费</option>
            <option value="refund">退款</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Job ID</th>
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Credit Change</th>
                    <th className="pb-4 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 text-white">{log.id}</td>
                      <td className="py-4 text-gray-300">{log.email || '-'}</td>
                      <td className="py-4 text-gray-400">{log.jobId || '-'}</td>
                      <td className="py-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${typeColors[log.usageType] || 'bg-gray-500'}`}></span>
                        <span className="ml-2 text-gray-300">{log.usageType}</span>
                      </td>
                      <td className={`py-4 font-semibold ${log.creditChange > 0 ? 'text-green-400' : log.creditChange < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                        {log.creditChange > 0 ? '+' : ''}{log.creditChange}
                      </td>
                      <td className="py-4 text-gray-400 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
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