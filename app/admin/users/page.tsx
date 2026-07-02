'use client'

import React, { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  username: string | null
  authProvider: string
  status: string
  createdAt: string
  lastLoginAt: string | null
}

interface UsersResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchUsers = async () => {
    setLoading(true)
    const url = new URL('/api/admin/users', window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', '10')
    if (search) url.searchParams.set('search', search)
    if (status) url.searchParams.set('status', status)

    const res = await fetch(url)
    const data: UsersResponse = await res.json()
    setUsers(data.data)
    setPagination({ total: data.pagination.total, pages: data.pagination.pages })
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search, status])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      active: { bg: '#e8f5e9', color: '#2e7d32' },
      disabled: { bg: '#ffebee', color: '#c62828' },
      pending: { bg: '#fff8e1', color: '#ef6c00' },
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

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Users</h1>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>用户管理</p>
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
            placeholder="搜索邮箱..."
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
            <option value="active">活跃</option>
            <option value="disabled">禁用</option>
            <option value="pending">待审核</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
        ) : users.length === 0 ? (
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
                    }}>Email</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Username</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: '600',
                      color: '#999',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Auth Provider</th>
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
                    }}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ transition: 'background-color 0.2s ease' }}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#333' }}>{user.id}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#333' }}>{user.email}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{user.username || '-'}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{user.authProvider}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>{getStatusBadge(user.status)}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{new Date(user.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '14px', color: '#999' }}>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}</td>
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
    </div>
  )
}