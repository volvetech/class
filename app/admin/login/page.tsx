'use client'

import React, { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    if (email === adminEmail && password === adminPassword) {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        window.location.href = '/admin'
      } else {
        setError('登录失败')
      }
    } else {
      setError('邮箱或密码不正确')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '48px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#333',
            marginBottom: '8px'
          }}>
            管理员登录
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#999' 
          }}>
            请使用管理员账号登录
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#333',
              marginBottom: '8px'
            }}>
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                transition: 'border-color 0.2s ease'
              }}
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#333',
              marginBottom: '8px'
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                transition: 'border-color 0.2s ease'
              }}
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <p style={{ color: '#c62828', fontSize: '13px', marginBottom: '8px' }}>{error}</p>
          )}
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            登录
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '13px', color: '#999' }}>
            默认账号: admin@example.com
          </p>
          <p style={{ fontSize: '13px', color: '#999' }}>
            默认密码: admin123
          </p>
        </div>
      </div>
    </div>
  )
}