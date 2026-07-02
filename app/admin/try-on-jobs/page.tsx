'use client'

import React, { useState, useEffect } from 'react'

interface Job {
  id: number
  userId: number | null
  email: string | null
  personImageId: number | null
  garmentImageId: number | null
  garmentCategory: string
  status: string
  modelName: string
  modelVersion: string
  errorMessage: string | null
  createdAt: string
  startedAt: string | null
  completedAt: string | null
}

interface JobsResponse {
  data: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function TryOnJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const fetchJobs = async () => {
    setLoading(true)
    const url = new URL('/api/admin/jobs', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (search) url.searchParams.set('search', search)
    if (status) url.searchParams.set('status', status)

    const res = await fetch(url)
    const data: JobsResponse = await res.json()
    setJobs(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [page, search, status])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      pending: { bg: '#fff8e1', color: '#ef6c00' },
      processing: { bg: '#e3f2fd', color: '#1565c0' },
      completed: { bg: '#e8f5e9', color: '#2e7d32' },
      failed: { bg: '#ffebee', color: '#c62828' },
    }
    const style = styles[status] || { bg: '#f5f5f5', color: '#666' }
    return (
      <span style={{ 
        display: 'inline-block', 
        padding: '4px 12px', 
        borderRadius: '4px', 
        fontSize: '12px', 
        fontWeight: '500',
        backgroundColor: style.bg,
        color: style.color
      }}>
        {status}
      </span>
    )
  }

  const categoryNames: Record<string, string> = {
    top: '上装',
    bottom: '下装',
    dress: '连衣裙',
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Try-on Jobs</h1>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>试衣任务管理</p>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        border: '1px solid #e5e5e5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="搜索用户邮箱..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333'
            }}
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333'
            }}
          >
            <option value="">所有状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>暂无数据</div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>ID</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>User</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Category</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Status</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Model</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Created At</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#333' }}>{job.id}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#333' }}>{job.email || '-'}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{categoryNames[job.garmentCategory] || job.garmentCategory}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>{getStatusBadge(job.status)}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{job.modelName}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{new Date(job.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>
                        <button
                          onClick={() => setSelectedJob(job)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#999' }}>共 {pagination.total} 条记录</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: page === 1 ? 0.5 : 1
                  }}
                >
                  上一页
                </button>
                <span style={{ padding: '8px 16px', color: '#999' }}>{page} / {pagination.pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: page === pagination.pages ? 0.5 : 1
                  }}
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedJob && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedJob(null)}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            width: '90%', 
            maxWidth: '600px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>任务详情 #{selectedJob.id}</h2>
              <button onClick={() => setSelectedJob(null)} style={{ color: '#999', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', color: '#999' }}>用户</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{selectedJob.email || '-'}</p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', color: '#999' }}>服装类别</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{categoryNames[selectedJob.garmentCategory] || selectedJob.garmentCategory}</p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', color: '#999' }}>状态</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{selectedJob.status}</p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', color: '#999' }}>模型</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{selectedJob.modelName} v{selectedJob.modelVersion}</p>
              </div>
            </div>

            {selectedJob.errorMessage && (
              <div style={{ padding: '12px', backgroundColor: '#ffebee', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ color: '#c62828', fontSize: '14px' }}>错误信息: {selectedJob.errorMessage}</p>
              </div>
            )}

            <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.8' }}>
              <p>创建时间: {new Date(selectedJob.createdAt).toLocaleString()}</p>
              <p>开始时间: {selectedJob.startedAt ? new Date(selectedJob.startedAt).toLocaleString() : '-'}</p>
              <p>完成时间: {selectedJob.completedAt ? new Date(selectedJob.completedAt).toLocaleString() : '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}