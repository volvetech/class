'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Person Images', href: '/admin/person-images' },
  { label: 'Garment Images', href: '/admin/garment-images' },
  { label: 'Garment Categories', href: '/admin/garment-categories' },
  { label: 'Try-on Jobs', href: '/admin/try-on-jobs' },
  { label: 'Try-on Results', href: '/admin/try-on-results' },
  { label: 'Feedback', href: '/admin/feedback' },
  { label: 'Usage Logs', href: '/admin/usage-logs' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname()

  const handleLogout = () => {
    document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/admin/login'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f5f5f5' }}>
      <aside style={{ 
        width: '220px', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e5e5e5',
        padding: '24px 0'
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #e5e5e5' }}>
          <h1 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Admin Panel
          </h1>
        </div>
        
        <nav style={{ padding: '16px 0' }}>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '10px 24px',
                    color: currentPath === item.href ? '#000' : '#666',
                    fontSize: '14px',
                    fontWeight: currentPath === item.href ? '500' : 'normal',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px 24px',
            textAlign: 'left',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#c62828',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
        >
          退出登录
        </button>
      </aside>
      
      <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}