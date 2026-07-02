'use client'

import React, { useState, useEffect } from 'react'

interface StatsResponse {
  totalUsers: number
  todayUsers: number
  totalJobs: number
  todayJobs: number
  successJobs: number
  failedJobs: number
  totalResults: number
  todayCredits: number
}

const statsConfig = [
  { label: '用户总数', key: 'totalUsers', color: '#2e7d32' },
  { label: '今日新增用户', key: 'todayUsers', color: '#1565c0' },
  { label: '总试衣任务', key: 'totalJobs', color: '#7b1fa2' },
  { label: '今日试衣任务', key: 'todayJobs', color: '#e65100' },
  { label: '成功任务', key: 'successJobs', color: '#2e7d32' },
  { label: '失败任务', key: 'failedJobs', color: '#c62828' },
  { label: '总生成结果', key: 'totalResults', color: '#0288d1' },
  { label: '今日消耗额度', key: 'todayCredits', color: '#f57c00' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse>({
    totalUsers: 0,
    todayUsers: 0,
    totalJobs: 0,
    todayJobs: 0,
    successJobs: 0,
    failedJobs: 0,
    totalResults: 0,
    todayCredits: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats')
    if (res.ok) {
      const data = await res.json()
      setStats(data)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>虚拟试衣后台管理控制台</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        {statsConfig.map((stat) => (
          <div 
            key={stat.key}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '20px',
              border: '1px solid #e5e5e5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <p style={{ fontSize: '28px', fontWeight: '600', color: stat.color }}>
              {stats[stat.key as keyof StatsResponse]}
            </p>
            <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '16px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
            最近任务
          </h2>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            暂无数据
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
            任务状态分布
          </h2>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            暂无数据
          </div>
        </div>
      </div>
    </div>
  )
}